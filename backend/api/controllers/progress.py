# api/controllers/progress.py
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from rest_framework.permissions import AllowAny

class ProgressView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, session_id):
        cache_key = f"progress_{session_id}"
        progress = cache.get(cache_key, 0)
        
        return Response({
            "percentage": progress,
            "session_id": session_id
        })
