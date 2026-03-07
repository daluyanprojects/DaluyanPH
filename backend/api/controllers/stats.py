from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny 
from api.utils.stats_helper import get_top_extreme_stats, calculate_area_sq_km

from api.models import FloodPatch


class ExtremeBarangayView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        session_id = request.query_params.get("sessionId")

        if not session_id:
            return Response({"error": "sessionId required"}, status=400)
        
        top_barangays = get_top_extreme_stats(session_id)

        results = [{
            "barangay": b["barangay_name"],
            "extreme_Hazard": b["extreme_count"],
            "area_sq_km": round(calculate_area_sq_km(b["extreme_count"]), 4)
        } for b in top_barangays]

        return Response({
            "session_id": session_id,
            "top_extreme_barangays": results
        })
    

