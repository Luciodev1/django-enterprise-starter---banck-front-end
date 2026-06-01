from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", views.CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("me/", views.UserMeView.as_view(), name="user_me"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("change-password/", views.ChangePasswordView.as_view(), name="change_password"),
]
