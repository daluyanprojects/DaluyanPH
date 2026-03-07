#api/utils/ml_handler.py
import logging
import os
import pandas as pd
import rasterio
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.db import transaction 
from api.models import FloodPatch
from ml.manila_quadrant.ml_handler_logic import run_manila_quadrant_inference
import sys
from pyproj import Transformer
from django.core.cache import cache
import time
import numpy as np


logger = logging.getLogger(__name__)
try:
    df = pd.read_csv(
        'ml\\resilience\\manila_barangays\\filtered_psgc_lookup.csv', 
        header=0, 
        names=['psgc', 'name'],
        dtype={'psgc': int}
    )
    psgc_to_name = dict(zip(df['psgc'], df['name']))
    
    # Fast Suffix Cache: handles the 100 vs 1307404100 mismatch
    suffix_lookup = {str(psgc)[-3:]: name for psgc, name in psgc_to_name.items()}
    suffix_lookup.update({str(psgc)[-4:]: name for psgc, name in psgc_to_name.items()})
    
    logger.info("PSGC Lookup and Suffix-cache loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load PSGC lookup: {e}")
    psgc_to_name = {}
    suffix_lookup = {}

def _get_gmm_rainfall_runner():
    # Ensure this points to the folder containing your main.py
    gmm_path = os.path.join(settings.BASE_DIR, "ml", "gmm_rainfall") 
    if gmm_path not in sys.path:
        sys.path.insert(0, gmm_path)
    
    # Change 'gmm_quadrant' to 'gmm_rainfall' to match your folder structure
    from ml.gmm_rainfall.main import run_gmm_rainfall_from_scenario 
    return run_gmm_rainfall_from_scenario

def process_resilience_to_db(tif_path, session_id, record):
    ctype = ContentType.objects.get_for_model(record)
    is_resiliency = (getattr(record, 'type', '') == 'resiliency')

    patches_to_create = [] 
    
    with rasterio.open(tif_path) as src:
        print(f"DEBUG: Processing file {tif_path} with {src.count} bands.")
        if src.count >= 3:
            ("DEBUG: Poverty sample values:", np.unique(src.read(3))[:10])
        transformer = Transformer.from_crs(src.crs, "EPSG:4326", always_xy=True)
        
        # Read bands based on the workflow
        band1 = src.read(1) # Always Hazard/Depth
        
        if is_resiliency:
            # Band 2 = PSGC, Band 3 = Poverty (DMFLR)
            psgc_band = src.read(2)
            poverty_band = src.read(3)
            confidence_band = None
        else:
            # Original Susceptibility mapping
            psgc_band = src.read(3)
            poverty_band = None
            confidence_band = src.read(2)

        affine = src.transform
        
        for row in range(0, src.height, 5): 
            for col in range(0, src.width, 5):
                risk_val = band1[row, col]
                psgc_val = psgc_band[row, col] if psgc_band is not None else 0

                if is_resiliency:
                    poverty_val = float(poverty_band[row, col]) if poverty_band is not None else None
                    conf_val = 1.0 # Default/Not applicable for Resiliency
                else:
                    poverty_val = None
                    raw_conf = float(confidence_band[row, col]) if confidence_band is not None else 1000.0
                    conf_val = raw_conf / 1000.0 if raw_conf > 1.0 else raw_conf


    
                if risk_val != 255 and psgc_val > 0:
                    # Get projected X, Y (in meters)
                    x_meters, y_meters = affine * (col, row)
                    
                    # 2. TRANSFORM TO LAT/LNG
                    lng, lat = transformer.transform(x_meters, y_meters)
                    
                    try:
                        pk_int = int(float(psgc_val))
                        name = psgc_to_name.get(pk_int) or suffix_lookup.get(str(pk_int)) or f"Barangay {pk_int}"
                    except:
                        name = "Unknown"

                    if len(patches_to_create) % 1000 == 0:
                        print(f"DEBUG: PSGC {pk_int} | Conf: {conf_val:.4f}")

                    patches_to_create.append(FloodPatch(
                        content_type=ctype,
                        object_id=session_id,
                        barangay_name=name,
                        psgc_code=int(psgc_val),
                        depth=float(risk_val),
                        poverty=poverty_val if poverty_val != -9999.0 else None,
                        confidence=conf_val,
                        lat=lat, # This will now be ~14.5
                        lng=lng, # This will now be ~120.9
                        location=f"POINT({lng} {lat})"
                    ))

    if patches_to_create:
        with transaction.atomic():
            FloodPatch.objects.filter(object_id=session_id).delete()
            FloodPatch.objects.bulk_create(patches_to_create)

# --- 3. ML DISPATCHER ---
def run_ml_inference(record, page_name, scenario_id):
    #start progress 
    cache_key = f"progress_{record.session_id}"
    cache.set(cache_key, 10, timeout=600)
    time.sleep(0.1)

    ml_config = {
        "type": record.type,
        "agent": record.agent.lower() if record.agent else "pedestrian",
        "isSoil": getattr(record, 'is_soil', False),
        "isDrainage": getattr(record, 'is_drainage', False),
    }
    # Fallback rainfall logic
    if hasattr(record, 'rainfall_scenario'):
        ml_config["rainfall"] = record.rainfall_scenario.lower()
    else:
        ml_config["rainfall"] = getattr(record, 'rainfall', 'low').lower()
    try:
        relative_path = None
        # Start with just Manila to verify the pipeline works
        if page_name == "manila-quadrant":
            relative_path = run_manila_quadrant_inference(ml_config, record.session_id)
        
        elif page_name == "gmm-partition":
            run_gmm = _get_gmm_rainfall_runner()

            # Data from the Scenario record
            agent_type = getattr(record, 'agent', 'pedestrian')
            if not agent_type:
                agent_type = 'pedestrian'
            rainfall = record.rainfall_scenario 
            depth_mm = float(record.depth_limit)
            tpeak    = float(record.triangular_peak) if record.triangular_peak else 0.5
            
            # Define session folder 
            session_folder = f"flood_tifs/{record.session_id}"
            out_dir = os.path.join(settings.MEDIA_ROOT, session_folder)
            os.makedirs(out_dir, exist_ok=True)

            # session 2 
            cache.set(cache_key, 30, timeout=600)

            results = run_gmm(
                rainfall_scenario=rainfall,
                depth_mm=depth_mm,
                tpeak=tpeak,
                session_id=record.session_id,
                output_dir=out_dir,
                agent_type=agent_type.lower()
            )

            # 3. ML Math finished, now processing file (70%)
            cache.set(cache_key, 90, timeout=600)
            
            # Convert absolute result path to a relative path for Django's FileField/URL
            tif_abs = str(results["tif_path"])
            relative_path = os.path.relpath(tif_abs, settings.MEDIA_ROOT)
        if relative_path:
            full_tif_path = os.path.join(settings.MEDIA_ROOT, relative_path)
            
            # Update Scenario model fields
            record.map_url = f"{settings.MEDIA_URL}{relative_path}"
            record.tif_file = relative_path 
            record.save()


            process_resilience_to_db(full_tif_path, record.session_id, record)
            return True
        logger.warning(f"ML Script did not return a path for {page_name}")
        return False
        
    except Exception as e:
        cache.set(cache_key, -1, timeout=600)
        logger.error(f"ML Dispatcher Error: {e}")
        import traceback
        print(traceback.format_exc())
        return False