# api/utils/helpers.py
import os
import rasterio
from rasterio.transform import xy
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict

# extract confidence from tif file and return as list of dicts with lat, lng, confidence and save to db
def extract_confidence_from_tif(tif_path):
    """
    - Gets FloodScenario using scenario_id
    - Reads associated TIF file
    - Extracts patches confidence values
    - Converts patches to lat/lng
    - Saves result to confidence_map (JSONField)
    - Returns list of dicts:
        [
            {"lat": ..., "lng": ..., "confidence": ...},
            ...
        ]
    """
    with rasterio.open(tif_path) as src:
        data = src.read(1)  # Read the first band
        transform = src.transform

        confidence_data = []
        for row in range(data.shape[0]):
            for col in range(data.shape[1]):
                confidence_value = data[row, col]
                if confidence_value > 0:  # Only consider non-zero confidence
                    lng, lat = xy(transform, row, col)
                    confidence_data.append({
                        "lat": lat,
                        "lng": lng,
                        "confidence": confidence_value
                    })

    return confidence_data




# read confidence from db and return as list of dicts with lat, lng, confidence
def get_confidence_from_db(scenario_id, include_tif=False):
    """
    - Gets FloodScenario using scenario_id
    - Reads confidence_map (JSONField)
    - Returns list of dicts:
        [
            {"lat": ..., "lng": ..., "confidence": ...},
            ...
        ]
    """
    # Import models here to avoid requiring project model imports at module import time
    from api.models import FloodScenario

    flood_scenario = get_object_or_404(FloodScenario, scenario_id=scenario_id)
    confidence_data = flood_scenario.confidence_map
    if include_tif:
        tif_url = None
        try:
            tif_url = flood_scenario.tif_file.url if getattr(flood_scenario, 'tif_file', None) else None
        except Exception:
            tif_url = None
        return confidence_data, tif_url
    return confidence_data

# read user request and return it for model input and pdf input 
def format_scenario_request(request):
    """
    - Reads user request data
    - Returns dict with relevant fields for model input and PDF generation
    """
    data = request.data
    formatted_data = {
        "session_id": data.get("session_id"),
        "type": data.get("type"),
        "rainfall": data.get("rainfall"),
        "is_soil": data.get("is_soil", False),
        "is_drainage": data.get("is_drainage", False),
        "agent": data.get("agent"),
    }
    return formatted_data
