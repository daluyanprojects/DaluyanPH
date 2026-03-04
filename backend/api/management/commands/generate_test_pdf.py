from django.core.management.base import BaseCommand
from core.download_template import create_pdf
from django.test import RequestFactory


class Command(BaseCommand):
    help = "Generate a test PDF from the download template"

    def add_arguments(self, parser):
        parser.add_argument('scenario_id', type=int, help="Scenario ID for the PDF")
        parser.add_argument('map_type', type=str, help="Map type (e.g., susceptibility, resilience)")

    def handle(self, *args, **options):
        scenario_id = options['scenario_id']
        map_type = options['map_type']
        
        try:
            factory = RequestFactory()
            request = factory.get('/')
            response = create_pdf(request, scenario_id, map_type)
            
            filename = f"test_pdf_{scenario_id}_{map_type}.pdf"
            with open(filename, "wb") as f:
                for chunk in response.streaming_content:
                    f.write(chunk)
            
            self.stdout.write(
                self.style.SUCCESS(f"✓ PDF generated successfully: {filename}")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"✗ Error generating PDF: {str(e)}")
            )
