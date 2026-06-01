from django.urls import path

from . import views

urlpatterns = [
    path("login/", views.LoginAPIView.as_view(), name="api_login"),
    path("refresh/", views.RefreshAPIView.as_view(), name="api_refresh"),
    path("logout/", views.LogoutAPIView.as_view(), name="api_logout"),
    path("me/", views.UserMeAPIView.as_view(), name="api_user_me"),
    path("register/", views.RegisterAPIView.as_view(), name="api_register"),
]
