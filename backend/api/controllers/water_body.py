from rest_framework.generics import ListAPIView
from api.models import WaterBody
from api.serializers import WaterBodySerializer
from rest_framework.permissions import AllowAny

class WaterBodyListView(ListAPIView):
    queryset = WaterBody.objects.all()
    serializer_class = WaterBodySerializer
    permission_classes = [AllowAny]