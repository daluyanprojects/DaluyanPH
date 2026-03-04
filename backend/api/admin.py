from django.contrib import admin
from django.contrib.gis import admin as gis_admin
from api.models import (
    ManilaQuadrantScenario, 
    ManilaPartitionScenario, 
    GMMQuadrantScenario, 
    GMMPartitionScenario,
    FloodPatch,
    WaterBody
)

# SPATIAL MODELS
@admin.register(WaterBody)
class WaterBodyAdmin(gis_admin.GISModelAdmin):
    list_display = ('name', 'water_type', 'lat', 'lng')
    list_filter = ('water_type',)
    search_fields = ('name',)

@admin.register(FloodPatch)
class FloodPatchAdmin(gis_admin.GISModelAdmin):
    list_display = ('barangay_name', 'psgc_code', 'depth', 'confidence', 'lat', 'lng')
    list_filter = ('depth', 'barangay_name')
    search_fields = ('barangay_name', 'psgc_code', 'object_id')

# --- 2. SCENARIO MODELS (Standard View) ---
admin.site.register(ManilaQuadrantScenario)
admin.site.register(ManilaPartitionScenario)
admin.site.register(GMMQuadrantScenario)
admin.site.register(GMMPartitionScenario)