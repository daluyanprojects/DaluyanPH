import uuid
from django.db import models
from .base_model import DaluyanBase
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
# Model 1 & 2: Manila Only
class ManilaQuadrantScenario(DaluyanBase):
    """ Page: Manila Quadrant Splitting """

    '''("Value_to_save", "Value_to_display" for dropdown)'''
    RAIN_SIMPLE = [("Light", "Light"), ("Medium", "Medium"), ("Heavy", "Heavy"), ("Extreme", "Extreme")]
    rainfall = models.CharField(max_length=20, choices=RAIN_SIMPLE)


class ManilaPartitionScenario(DaluyanBase):
    """ Page: Manila Rainfall Partition """
    RAIN_COMPLEX = [("SCS-style front-loaded", "SCS-style front-loaded"), ("SCS-style back-loaded", "SCS-style back-loaded"), ("SCS-style balanced", "SCS-style balanced"), ("Chicago-style Triangular", "Chicago-style Triangular")]
    rainfall_scenario = models.CharField(max_length=100, choices=RAIN_COMPLEX)
    is_land_use = models.BooleanField(default=False)
    is_infiltration = models.BooleanField(default=False)


# Model 3 & 4: Greater Manila 
class GMMQuadrantScenario(DaluyanBase):
    """ Page: GMM Quadrant Splitting """
    RAIN_SIMPLE = [("Light", "Light"), ("Medium", "Medium"), ("Heavy", "Heavy"), ("Extreme", "Extreme")]
    rainfall = models.CharField(max_length=100, choices=RAIN_SIMPLE)
    is_land_use = models.BooleanField(default=False)
    is_infiltration = models.BooleanField(default=False)


TRAINING_RANGES = {
    'front-loaded': {'depth_mm': (6, 78), 'tpeak': None},
    'balanced': {'depth_mm': (19, 78), 'tpeak': None},
    'back-loaded': {'depth_mm': (7, 75), 'tpeak': None},
    'triangular': {'depth_mm': (5, 77), 'tpeak': (0.1, 0.9)},
}

class GMMPartitionScenario(DaluyanBase):
    """ Page: GMM Rainfall Partition """
    RAIN_COMPLEX = [
        ("front-loaded", "SCS-style front-loaded"),
        ("back-loaded", "SCS-style back-loaded"),
        ("balanced", "SCS-style balanced"),
        ("triangular", "Chicago-style Triangular"),
    ]
    rainfall_scenario = models.CharField(max_length=100, choices=RAIN_COMPLEX)
    is_land_use = models.BooleanField(default=True)
    is_infiltration = models.BooleanField(default=True)
    depth_limit = models.FloatField(default=0.0)

    triangular_peak = models.FloatField(
        null=True,
        blank=True
    )

    def clean(self):
        super().clean()
        
        # 1. Grab the specific limits for the chosen scenario
        limits = TRAINING_RANGES.get(self.rainfall_scenario)
        if not limits:
            return

        # 2. Enforce Depth Limits (e.g., 6 to 78 for front-loaded)
        min_d, max_d = limits['depth_mm']
        if not (min_d <= self.depth_limit <= max_d):
            raise ValidationError({
                'depth_limit': f"For {self.get_rainfall_scenario_display()}, "
                               f"depth must be between {min_d} and {max_d} mm."
            })

        # 3. Enforce Peak Limits (tpeak)
        t_range = limits['tpeak']
        if t_range:
            min_t, max_t = t_range
            if self.triangular_peak is None:
                raise ValidationError({'triangular_peak': "This scenario requires a peak value."})
            if not (min_t <= self.triangular_peak <= max_t):
                raise ValidationError({'triangular_peak': f"Peak must be between {min_t} and {max_t}."})
        elif self.triangular_peak is not None:
             raise ValidationError({'triangular_peak': "Peak is not used for this scenario."})