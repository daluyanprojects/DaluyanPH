# api/controller/flood_patch.py
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import (
    ManilaQuadrantScenario, ManilaPartitionScenario,
    GMMQuadrantScenario, GMMPartitionScenario,
    FloodPatch
)
from uuid import UUID
from django.contrib.gis.measure import D

class PatchDataView(APIView):
    permission_classes = [AllowAny]

    def get_model_class(self, page_name):
        mapping = {
            "manila-quadrant": ManilaQuadrantScenario,
            "manila-partition": ManilaPartitionScenario,
            "gmm-quadrant": GMMQuadrantScenario,
            "gmm-partition": GMMPartitionScenario,
        }
        return mapping.get(page_name)

    def post(self, request, scenario_id):
        scenario_id = UUID(str(scenario_id))
        lat = request.data.get("lat")
        lng = request.data.get("lng")
        page_name = request.data.get("page_name")

        #print(f"--- HOVER DEBUG ---")
        #print(f"Scenario: {scenario_id} | Point: ({lng}, {lat})")

        ModelClass = self.get_model_class(page_name)
        if not ModelClass or lat is None or lng is None:
            return Response({"error": "Invalid parameters"}, status=400)

        try:
            scenario = ModelClass.objects.get(session_id=scenario_id)
            is_resiliency = scenario.type == "resiliency"
            pnt = Point(float(lng), float(lat), srid=4326)

            patch = FloodPatch.objects.filter(
                object_id=scenario.session_id,
                location__distance_lte=(pnt, D(m=200)) 
            ).annotate(
                distance=Distance('location', pnt)
            ).order_by('distance').first()

            if patch:
                #print(f"✅ Found Patch: {patch.barangay_name} | Dist: {patch.distance.m:.2f}m")
                
                response_data = {
                    "type": scenario.type,
                    "barangay_name": patch.barangay_name,
                    "hazardValue": patch.depth,          
                    "latlng": {                        
                        "lat": patch.lat, 
                        "lng": patch.lng
                    },
                    "containerPoint": request.data.get("containerPoint") 
                }
                
                if not is_resiliency:
                    response_data["confidence"] = patch.confidence
                
                # IMPORTANT: Return the data immediately once found!
                return Response(response_data)
            
            # If no patch was found in the block above
           # print(f"❌ No patch found within 200m of ({lng}, {lat})")
            return Response({"message": "No data nearby"}, status=200)

        except ModelClass.DoesNotExist:
            return Response({"error": "Scenario not found"}, status=404)
        except Exception as e:
           # print(f"💥 Unexpected Error: {e}")
            return Response({"error": "Internal Server Error"}, status=500)
        
    def get(self, request, scenario_id):
        """
        GET the full list of patches (if needed for initial load).
        """
        page_name = request.query_params.get("page_name")
        ModelClass = self.get_model_class(page_name)

        if not ModelClass:
            return Response({"error": "Invalid page_name"}, status=400)

        try:
            scenario = ModelClass.objects.get(session_id=scenario_id)
            is_resiliency = scenario.type == "resiliency"
            patches = FloodPatch.objects.filter(object_id=scenario.session_id)

            patch_list=[]

            for patch in patches:
                item = {
                    "lat": patch.lat,
                    "lng": patch.lng,
                    "depth": patch.depth,
                    "barangay": patch.barangay_name,
                }
                if not is_resiliency:
                    item["confidence"] = patch.confidence

                patch_list.append(item)

            return Response({
                "type": scenario.type,
                "data_map": patch_list,
                "tif_file": scenario.tif_file.url if scenario.tif_file else None,
            })
        except ModelClass.DoesNotExist:
            return Response({"error": "Scenario not found"}, status=404)