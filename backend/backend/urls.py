"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.controllers.daluyan_map import CreateMapView, GetMapView
from api.controllers.download_map import DownloadMapView 
from api.controllers.flood_patch import PatchDataView
from api.controllers.water_body import WaterBodyListView
from django.conf import settings
from django.conf.urls.static import static
from api.controllers.run_resilience import RunResilienceView
from django.views.decorators.csrf import csrf_exempt
from api.controllers.progress import ProgressView
from api.controllers.building_hover import BuildingLayerView
from api.controllers.stats import ExtremeBarangayView
urlpatterns = [
    path('admin/', admin.site.urls),

    path("export-map-pdf/", DownloadMapView.as_view(), name="download_map"),
    path("daluyan-map/download/", DownloadMapView.as_view(), name="download_map"),
    path("daluyan-map/create/", CreateMapView.as_view(), name="create_map"), 
    path("daluyan-map/", GetMapView.as_view(), name="get_map"), 
    
    path("daluyan-map/flood-patch/<uuid:scenario_id>/", PatchDataView.as_view(), name="get_flood_patch"),
    
    path('water-bodies/', WaterBodyListView.as_view(), name='water-bodies-list'),

    path("daluyan-map/resilience/run/", csrf_exempt(RunResilienceView.as_view()), name="run_resilience"),

    path('api/progress/<str:session_id>/', ProgressView.as_view(), name='progress'),

    path('api/buildings/', BuildingLayerView.as_view(), name='building-layer'),
    path("daluyan-map/extreme-barangays/", ExtremeBarangayView.as_view(), name="extreme_barangays"),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)