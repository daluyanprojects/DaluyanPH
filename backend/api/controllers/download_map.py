# api/controllers/download_map.py
import os
import logging
from django.conf import settings
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from core.download_template import create_susc_pdf
from core.download_res_template import create_res_pdf
from api.models import (
    ManilaQuadrantScenario, ManilaPartitionScenario,
    GMMQuadrantScenario, GMMPartitionScenario
)
from api.controllers.daluyan_map import get_model_and_serializer 
from api.utils.ml_handler import run_ml_inference 

logger = logging.getLogger(__name__)

class DownloadMapView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        print("!!! DOWNLOAD VIEW TRIGGERED !!!")
        session_id = request.query_params.get("sessionId")
        psession_id = request.query_params.get("sessionId")
        page_name = request.query_params.get("page_name")
        map_type = request.query_params.get("mapType")

        # DEBUGGING: See exactly what the frontend is sending
        print(f"DEBUG: page_name={page_name}, map_type={map_type}")

        template_router = {
            "resiliency": create_res_pdf,
            "susceptibility": create_susc_pdf
        }

        # Normalize the input to avoid case-sensitivity issues
        key = map_type.lower() if map_type else ""
        generator_func = template_router.get(key, create_susc_pdf)
        
        export_type = request.query_params.get("format", "pdf") # default to pdf
        ModelClass, _ = get_model_and_serializer(page_name)
        scenario = get_object_or_404(ModelClass, session_id=session_id)

        if not scenario.map_url:
            return Response({"error": "Map not generated"}, status=404)

        # Build path (Ensure this points to where your .tif or .png is)
        file_name = f"flood_{session_id}.tif"
        if not scenario.tif_file:
            return Response({"error": "File missing"}, status=404)

        file_path = scenario.tif_file.path

        print(f"CHECKING PATH: {file_path}") # This will show in your terminal

        if not os.path.exists(file_path):
            return Response({"error": "File missing on server"}, status=404)

        try:
            # Generate PDF using the scenario object
            pdf_buffer = generator_func(request, scenario, page_name, file_path)
            
            return FileResponse(
                pdf_buffer,
                as_attachment=True,
                filename=f"DaluyanPH_{page_name}_{session_id[:8]}.pdf",
                content_type='application/pdf'
            )
        except Exception as e:
            logger.error(f"PDF Error: {str(e)}")
            return Response({"error": "Internal PDF Error"}, status=500)