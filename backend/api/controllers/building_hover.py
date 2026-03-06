import os
import json # <--- ADD THIS
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import geopandas as gpd

class BuildingLayerView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request):
        shp_path = os.path.join(
            settings.BASE_DIR, 
            'ml', 
            'manila_buildings', 
            'final_manila_building_daluyan.shp'
        )
        if not os.path.exists(shp_path):
            return JsonResponse({"error": "File not found"}, status=404)
        
        gdf = gpd.read_file(shp_path)
        if gdf.crs != "EPSG:4326":
            gdf = gdf.to_crs("EPSG:4326")
            
        # Correctly converting GeoJSON string to Python dictionary
        data = json.loads(gdf.to_json())
        return JsonResponse(data, safe=False)