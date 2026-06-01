import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def user(client):
    u = User.objects.create_user(
        email="user@test.com", password="Test@1234",
        first_name="Test", last_name="User"
    )
    return u


class TestAuthAPI:
    def test_login_success(self, client, user):
        response = client.post("/api/v1/accounts/login/", {
            "email": "user@test.com", "password": "Test@1234"
        })
        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert "access" in response.data["data"]

    def test_login_invalid_password(self, client, user):
        response = client.post("/api/v1/accounts/login/", {
            "email": "user@test.com", "password": "wrong"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, client):
        response = client.post("/api/v1/accounts/login/", {
            "email": "noone@test.com", "password": "Test@1234"
        })
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_me_authenticated(self, client, user):
        client.force_authenticate(user=user)
        response = client.get("/api/v1/accounts/me/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["data"]["email"] == "user@test.com"

    def test_me_unauthenticated(self, client):
        response = client.get("/api/v1/accounts/me/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_register(self, client):
        response = client.post("/api/v1/accounts/register/", {
            "email": "new@test.com",
            "first_name": "New",
            "last_name": "User",
            "password": "New@1234",
            "password_confirm": "New@1234",
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["success"] is True

    def test_register_duplicate_email(self, client, user):
        response = client.post("/api/v1/accounts/register/", {
            "email": "user@test.com",
            "first_name": "Another",
            "last_name": "User",
            "password": "New@1234",
            "password_confirm": "New@1234",
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
