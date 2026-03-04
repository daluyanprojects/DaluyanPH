# validates frontend data before saving
# convert data to json format so react can read it 

from rest_framework import serializers
from api.models import (
    ManilaQuadrantScenario, ManilaPartitionScenario,
    GMMQuadrantScenario, GMMPartitionScenario
)
from api.models import WaterBody

# base serializer 
class BaseSerializer(serializers.ModelSerializer):
    class Meta: 
        fields  = [
            "id",
            "session_id",
            "type",
            "agent",
            "created_at",
            "dem",
            "is_soil",
            "is_drainage",
            "map_url",
            "tif_file",
        ]

# inherit base serializer
class ManilaQuadrantSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = ManilaQuadrantScenario
        fields = BaseSerializer.Meta.fields + ['rainfall']


class ManilaPartitionSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = ManilaPartitionScenario
        fields = BaseSerializer.Meta.fields + ['rainfall_scenario', 'is_land_use', 'is_infiltration']

class GMMQuadrantSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = GMMQuadrantScenario
        fields = BaseSerializer.Meta.fields + ['rainfall', 'is_land_use', 'is_infiltration']

class GMMPartitionSerializer(BaseSerializer):
    class Meta(BaseSerializer.Meta):
        model = GMMPartitionScenario
        fields = BaseSerializer.Meta.fields + ['rainfall_scenario', 'depth_limit', 'triangular_peak']

    def validate_triangular_peak(self, value):
        if value is not None:
            if value < 0 or value > 1:
                raise serializers.ValidationError("Peak must be a decimal between 0.0 and 1.0.")
        return value

class WaterBodySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = WaterBody
        fields = ['id', 'name', 'water_type', 'lat', 'lng', 'description', 'image_url']

    def get_image_url(self, obj):
        if obj.image_file:
            return obj.image_file.url
        return None


