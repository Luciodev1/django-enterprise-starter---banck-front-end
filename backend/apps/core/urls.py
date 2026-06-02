from django.urls import include, path

from .api import DashboardStatsAPIView, HealthCheckAPIView

urlpatterns = [
    path("health/", HealthCheckAPIView.as_view(), name="api_health"),
    path("dashboard/stats/", DashboardStatsAPIView.as_view(), name="api_dashboard_stats"),
]
