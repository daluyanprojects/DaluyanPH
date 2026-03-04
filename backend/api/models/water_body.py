from django.contrib.gis.db import models as gis_models

class WaterBody(gis_models.Model):
    name = gis_models.CharField(max_length=255)
    water_type = gis_models.CharField(max_length=100) # 'river' or 'estero'
    description = gis_models.TextField(blank=True, null=True)
    image_file = gis_models.ImageField(upload_to='rivers/', blank=True, null=True) 
    
    # PostGIS fields
    location = gis_models.PointField(srid=4326)
    lat = gis_models.FloatField()
    lng = gis_models.FloatField()

    def __str__(self):
        return f"{self.name} ({self.water_type})"