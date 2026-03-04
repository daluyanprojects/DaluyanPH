from datetime import timedelta
from django.db import models
from django.utils import timezone

""" checks if the scenario is expired (older than 5 hours) and returns a string representation of the scenario """
def is_expired(instance):
        return instance.created_at < timezone.now() - timedelta(hours=5)

""" returns a string representation of the scenario, including the type and creation time """
def get_scenario_str(instance):
   return f"Scenario {instance.session_id} ({instance.type})" 