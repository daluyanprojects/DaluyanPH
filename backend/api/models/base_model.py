from django.db import models
from django.contrib.gis.db import models as gis_models
from api.utils.model_helper import is_expired, get_scenario_str

class DaluyanBase(models.Model):
    session_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # type of map 
    TYPE_CHOICES = [
        ("susceptibility", "Susceptibility"),
        ("resiliency", "Resiliency"),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="susceptibility")

    # agent 
    AGENT_CHOICES = [
        ("Pedestrian", "Pedestrian"),
        ("Vehicle", "Vehicle"),
    ]
    agent = models.CharField(max_length=20, choices=AGENT_CHOICES, null=True, default=None, blank=True)
    
    #  Inputs
    dem = models.BooleanField(default=True)
    is_soil = models.BooleanField(default=False)
    is_drainage = models.BooleanField(default=False)
    
    # Result 
    map_url = models.URLField(null=True, blank=True)
    tif_file = models.FileField(upload_to='flood_tifs/', null=True, blank=True)

    # Like OOP the other modesl will inherit this base model 
    class Meta:
        abstract = True # not to make a 'DaluyanBase' table

    @property
    def is_expired(self): return is_expired(self)
    def __str__(self): return get_scenario_str(self)