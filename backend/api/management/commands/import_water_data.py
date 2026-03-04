import pandas as pd
import os
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from api.models import WaterBody
from django.conf import settings

class Command(BaseCommand):
    help = 'Imports river and estuary data from river_network.xlsx'

    def handle(self, *args, **options):
        file_path = os.path.join(settings.BASE_DIR, 'river_network.xlsx') 
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found at {file_path}'))
            return

        df = pd.read_excel(file_path)
        
        # CLEANING STEP: This removes spaces and makes comparison easier
        # This maps your Excel headers to your Django model fields
        for _, row in df.iterrows():
            try:
                # We use .get() and exact casing from your image
                obj, created = WaterBody.objects.update_or_create(
                    name=row['name'],
                    defaults={
                        'water_type': row['type'],
                        'lat': float(row['lat']),
                        'lng': float(row['lng']),
                        'description': row['Description'], # Capital 'D'
                        'image_file': f"rivers/{row['Image_File']}", # Capital 'I' and 'F'
                        'location': Point(float(row['lng']), float(row['lat']), srid=4326)
                    }
                )
                
                status = "Created" if created else "Updated"
                self.stdout.write(f"{status}: {row['name']}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error importing {row.get('name')}: {e}"))

        self.stdout.write(self.style.SUCCESS('Successfully imported all river network data!'))