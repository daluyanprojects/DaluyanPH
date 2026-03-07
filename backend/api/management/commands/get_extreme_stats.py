from django.core.management.base import BaseCommand
from django.db.models import Count
from api.models import FloodPatch

class Command(BaseCommand):
    help = 'Calculates and displays the top 5 barangays with extreme hazard levels.'

    def add_arguments(self, parser):
        parser.add_argument('sessionId', type=str, help='The session ID to analyze')

    def handle(self, *args, **options):
        session_id = options['sessionId']

        # Reuse your logic
        top_barangays = (
            FloodPatch.objects
            .filter(object_id=session_id, depth=4)
            .values("barangay_name")
            .annotate(extreme_count=Count("id"))
            .order_by("-extreme_count")[:5]
        )

        self.stdout.write(self.style.SUCCESS(f"--- Top 5 Barangays for Session: {session_id} ---"))
        
        for b in top_barangays:
            self.stdout.write(f"Barangay: {b['barangay_name']} | Extreme Hazard Count: {b['extreme_count']}")
            
        if not top_barangays:
            self.stdout.write(self.style.WARNING("No extreme patches found for this session."))