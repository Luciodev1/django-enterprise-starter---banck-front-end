from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"users", views.UserViewSet, basename="user")

urlpatterns = [
    path("login/", views.LoginAPIView.as_view(), name="api_login"),
    path("refresh/", views.RefreshAPIView.as_view(), name="api_refresh"),
    path("logout/", views.LogoutAPIView.as_view(), name="api_logout"),
    path("register/", views.RegisterAPIView.as_view(), name="api_register"),
    path("change-password/", views.ChangePasswordAPIView.as_view(), name="api_change_password"),
    path("password-reset/request/", views.PasswordResetRequestAPIView.as_view(), name="api_password_reset_request"),
    path("password-reset/confirm/", views.PasswordResetConfirmAPIView.as_view(), name="api_password_reset_confirm"),
    path("email-verification/request/", views.EmailVerificationRequestAPIView.as_view(), name="api_email_verification_request"),
    path("email-verification/confirm/", views.EmailVerificationConfirmAPIView.as_view(), name="api_email_verification_confirm"),
    path("me/", views.UserMeAPIView.as_view(), name="api_user_me"),
    path("", include(router.urls)),
]
