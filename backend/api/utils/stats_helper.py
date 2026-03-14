from django.db.models import Count
from api.models import FloodPatch

def get_top_extreme_stats(session_id):
    """Retrieves the top 5 barangays for a given session."""
    return FloodPatch.objects.filter(object_id=session_id, depth=4) \
        .values("barangay_name") \
        .annotate(extreme_count=Count("id")) \
        .order_by("-extreme_count")[:5]

def calculate_area_sq_km(patch_count):
    """Calculates physical area in sq km based on 4x4 pixel patches."""
    px_width = 29.296875
    px_height = 31.875
    single_pixel_area = px_width * px_height
    patch_area_sq_m = 16 * single_pixel_area
    patch_area_sq_km = (patch_count * patch_area_sq_m) / 1_000_000
    return patch_area_sq_km