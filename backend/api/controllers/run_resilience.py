import sys
import os
import subprocess
import traceback
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.models import ManilaQuadrantScenario, GMMQuadrantScenario
from api.serializers.scenario_serializer import ManilaQuadrantSerializer, GMMQuadrantSerializer
from api.controllers.daluyan_map import get_model_and_serializer
from django.conf import settings
from api.models import FloodPatch
from django.contrib.contenttypes.models import ContentType
from api.utils.ml_handler import process_resilience_to_db

RESILIENCE_SCRIPT = os.path.join(
    os.path.dirname(__file__),
    "../../ml/resilience/resilience_main.py"
)

@method_decorator(csrf_exempt, name='dispatch')
class RunResilienceView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            session_id = request.data.get("session_id")
            page_name  = request.data.get("page_name")

            if not session_id or not page_name:
                return Response({"error": "Missing session_id or page_name"}, status=400)

            # --- DYNAMIC SCRIPT SELECTION ---
            # Point to the correct script based on the page_name
            if "gmm" in page_name:
                script_path = os.path.join(
                    settings.BASE_DIR, "ml", "gmm_rainfall", "main_resilience.py"
                )
            else:
                script_path = os.path.join(
                    settings.BASE_DIR, "ml", "resilience", "resilience_main.py"
                )

            ModelClass, SerializerClass = get_model_and_serializer(page_name)

            try:
                scenario = ModelClass.objects.get(session_id=session_id)
            except ModelClass.DoesNotExist:
                return Response({"error": f"Scenario not found: {session_id}"}, status=404)
            
            # Clear old tooltips (FloodPatches) before re-calculating
            target_ctype = ContentType.objects.get_for_model(scenario)
            FloodPatch.objects.filter(
                content_type=target_ctype, 
                object_id=scenario.session_id
            ).delete()

            flood_tif_path = scenario.tif_file.path 
            resilience_folder = os.path.join(settings.BASE_DIR, "api", "resilience_outputs", session_id)
            os.makedirs(resilience_folder, exist_ok=True)

            env = os.environ.copy()
            env["PYTHONPATH"] = str(settings.BASE_DIR) + os.pathsep + env.get("PYTHONPATH", "")

            # Run the selected script
            result = subprocess.run(
                [
                    sys.executable,
                    script_path, # Using the dynamic path here
                    "--flood_tif",  flood_tif_path,
                    "--session_id", session_id,
                    "--page_name",  page_name, # Pass page_name so script knows which assets to load
                    "--out_dir",    resilience_folder
                ],
                capture_output=True,
                text=True,
                env=env
            )

            if result.returncode != 0:
                print(f"SCRIPT ERROR: {result.stderr}")
                return Response({"error": result.stderr}, status=500)

            # Get the TIF path printed by the script
            full_out_path = result.stdout.strip().split('\n')[-1] 
            
            # TRIGGER THE PIXEL-TO-DB PROCESSING (For tooltips)
            process_resilience_to_db(full_out_path, session_id, scenario)

            # Update the scenario with the new resilience TIF
            relative_path = os.path.relpath(full_out_path, settings.MEDIA_ROOT)
            scenario.tif_file = relative_path
            scenario.save()

            serializer = SerializerClass(scenario)
            return Response(serializer.data, status=200)

        except Exception as e:
            print(f"EXCEPTION: {traceback.format_exc()}")
            return Response({"error": str(e)}, status=500)