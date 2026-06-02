from django.urls import include, path

urlpatterns = [
    path("accounts/", include("apps.accounts.api.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("audit/", include("apps.audit.urls")),
    path("", include("apps.core.urls")),
]
