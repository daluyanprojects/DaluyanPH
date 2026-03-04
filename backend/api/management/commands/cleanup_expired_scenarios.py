import os
import shutil
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
from api.models import (
    ManilaQuadrantScenario, ManilaPartitionScenario, 
    GMMQuadrantScenario, GMMPartitionScenario
)

class Command(BaseCommand):
    help = 'Delete scenarios older than 5 hours and their associated files/directories'

    def handle(self, *args, **options):
        expiry_time = timezone.now() - timedelta(hours=5)
        
        # All models that have a 'created_at' and 'session_id'
        models_to_clean = [
            ManilaQuadrantScenario, 
            ManilaPartitionScenario, 
            GMMQuadrantScenario, 
            GMMPartitionScenario
        ]

        total_deleted = 0
        total_folders_removed = 0

        for Model in models_to_clean:
            # 1. Find expired records for THIS model
            expired_qs = Model.objects.filter(created_at__lt=expiry_time)
            count = expired_qs.count()
            
            if count == 0:
                continue

            for scenario in expired_qs:
                # 2. Delete the physical directory associated with the session
                # Based on your ml_handler.py, files are in MEDIA_ROOT/gmm_results/<session_id>
                # or MEDIA_ROOT/manila_results/<session_id>
                
                # Check for GMM style folders
                gmm_path = os.path.join(settings.MEDIA_ROOT, "flood_tifs", str(scenario.session_id))
                # Check for Manila style folders
                
                for path in gmm_path:
                    if os.path.exists(path):
                        try:
                            shutil.rmtree(path)
                            total_folders_removed += 1
                        except Exception as e:
                            self.stdout.write(self.style.WARNING(f"Could not delete folder {path}: {e}"))

                # 3. Delete the database record
                # This will also delete related FloodPatch records if CASCADE is set
                scenario.delete()
                total_deleted += 1

            self.stdout.write(self.style.SUCCESS(f"Processed {Model.__name__}: {count} deleted."))

        # 4. Optional: Clean orphaned TIFs in the root MEDIA_ROOT if any exist
        # Only do this if you have files stored outside session folders
        self.cleanup_orphaned_media()

        self.stdout.write(self.style.SUCCESS(
            f'FINISHED: Deleted {total_deleted} scenarios and removed {total_folders_removed} session folders.'
        ))

    def cleanup_orphaned_media(self):
        """Logic to handle files not inside session folders if necessary."""
        # Add logic here only if you have a specific 'flood_tifs' directory 
        # that isn't managed by session_id folders.
        pass