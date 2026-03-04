#api/models/flood_patch.py
from django.contrib.gis.db import models as gis_models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

class FloodPatch(models.Model):
    # --- Generic Relationship ---
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.CharField(max_length=255) # Stores the session_id
    parent_scenario = GenericForeignKey('content_type', 'object_id')
    # --- Data Fields ---
    barangay_name = models.CharField(max_length=255, db_index=True)
    psgc_code = models.BigIntegerField(db_index=True, null=True, blank=True)
    depth = models.FloatField()
    confidence = models.FloatField()
    # --- PostGIS Spatial Field ---
    # srid 4326  standard GPS coordinates
    location = gis_models.PointField(srid=4326)
    lat = models.FloatField()
    lng = models.FloatField()

    def save(self, *args, **kwargs):
        # Ensure lat/lng are consistent with location
        if self.location:
            self.lat = self.location.y
            self.lng = self.location.x
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.barangay_name}: {self.depth}m"