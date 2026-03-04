#api/utils/spatial_helpers.py
import numpy as np
from rasterio.transform import xy
from pyproj import Transformer
from django.contrib.gis.geos import Point
from api.models import FloodPatch
from api.utils.pasgc_helper import get_barangay_from_psgc  


def extract_and_save_flood_patches(
    pred_arr,
    conf_arr,
    psgc_arr,
    session_id,
    transform,
    content_type,
    raster_crs,
    step=8
):
    """
    susceptability
    pred_arr  -> Band 1 (hazard)
    conf_arr  -> Band 2 (confidence)
    psgc_arr  -> Band 3 (PSGC)
    raster_crs -> src.crs from rasterio
    """

    # Convert from raster CRS (EPSG:3857) to EPSG:4326
    transformer = Transformer.from_crs(
        raster_crs,
        "EPSG:4326",
        always_xy=True
    )

    # Delete old patches
    FloodPatch.objects.filter(
        content_type=content_type,
        object_id=session_id
    ).delete()

    patches = []
    rows, cols = pred_arr.shape

    for r in range(0, rows, step):
        for c in range(0, cols, step):

            hazard_val = pred_arr[r, c]

            # Skip nodata
            if hazard_val in (0, 255) or np.isnan(hazard_val):
                continue

            # Get projected x/y from raster
            x_proj, y_proj = xy(transform, r, c)

            # Convert meters -> lat/lng
            lng, lat = transformer.transform(x_proj, y_proj)

            # Confidence
            conf_val = conf_arr[r, c]
            if np.isnan(conf_val) or np.isinf(conf_val):
                conf_val = 0.0

            if conf_val > 1.0:
                conf_val = conf_val / 100.0

            # PSGC
            psgc_val = None
            if psgc_arr is not None:
                raw_psgc = psgc_arr[r, c]
                if not np.isnan(raw_psgc):
                    psgc_val = int(raw_psgc)

            patches.append(
                FloodPatch(
                    content_type=content_type,
                    object_id=session_id,
                    barangay_name=get_barangay_from_psgc(psgc_val),
                    psgc_code=psgc_val,
                    depth=float(hazard_val),
                    confidence=float(conf_val),
                    location=Point(lng, lat, srid=4326),
                )
            )

    if patches:
        FloodPatch.objects.bulk_create(patches, batch_size=1000)
        return len(patches)

    return 0