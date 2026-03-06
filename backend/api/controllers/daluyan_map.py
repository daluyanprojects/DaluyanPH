from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.core.files.base import ContentFile
from django.http import FileResponse
from django.conf import settings
import logging
import os

from api.utils.ml_handler import run_ml_inference

# Models and serializers
from api.models import (
    ManilaQuadrantScenario, ManilaPartitionScenario,
    GMMQuadrantScenario, GMMPartitionScenario
)
from api.serializers.scenario_serializer import (
    ManilaQuadrantSerializer, ManilaPartitionSerializer,
    GMMQuadrantSerializer, GMMPartitionSerializer
)

# HELPER
def get_model_and_serializer(page_name):
    """Helper to map page names to specific database models and serializers."""
    mapping = {
        "manila-quadrant": (ManilaQuadrantScenario, ManilaQuadrantSerializer),
        "manila-partition": (ManilaPartitionScenario, ManilaPartitionSerializer),
        "gmm-quadrant": (GMMQuadrantScenario, GMMQuadrantSerializer),
        "gmm-partition": (GMMPartitionScenario, GMMPartitionSerializer),
    }
    return mapping.get(page_name, (None, None))

logger = logging.getLogger(__name__)

class CreateMapView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        page_name = data.get("page_name")
        
        # Call the shared helper (no 'self.')
        ModelClass, SerializerClass = get_model_and_serializer(page_name)

        if not ModelClass:
            return Response({"error": "Invalid page_name provided"}, status=400)

        data["type"] = data.get("type", "susceptibility")
        if data["type"] == "resiliency":
            data["agent"] = None

        serializer = SerializerClass(data=data)
        if serializer.is_valid():
            scenario = serializer.save()
            
            ml_success = run_ml_inference(scenario, page_name, scenario.id)


            if ml_success:
                # Return the updated data (which now includes the map_url)
                return Response(SerializerClass(scenario).data, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "ML Inference failed"}, status=500)
            
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetMapView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        session_id = request.query_params.get("sessionId")
        page_name = request.query_params.get("page_name")
        
        # 2. FIXED: Use the shared helper here too
        ModelClass, SerializerClass = get_model_and_serializer(page_name)
        
        if not ModelClass:
            return Response({"error": "Invalid page_name"}, status=400)

        scenario = get_object_or_404(ModelClass, session_id=session_id)
        
        if request.query_params.get("tif") == "true":
            if not scenario.tif_file:
                return Response({"error": "TIF not found"}, status=404)
            return FileResponse(scenario.tif_file.open('rb'), content_type='image/tiff')

        # 3. FIXED: Use the SerializerClass found by the helper
        serializer = SerializerClass(scenario)
        return Response(serializer.data)