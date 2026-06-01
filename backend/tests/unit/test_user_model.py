import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


class TestUserModel:
    def test_create_user(self, user_data):
        user = User.objects.create_user(**user_data)
        assert user.email == user_data["email"]
        assert user.check_password(user_data["password"])
        assert not user.is_staff
        assert not user.is_superuser
        assert user.role == "client"

    def test_create_superuser(self):
        user = User.objects.create_superuser(
            email="admin@test.com", password="Admin@1234",
            first_name="Admin", last_name="User"
        )
        assert user.is_staff
        assert user.is_superuser
        assert user.role == "superadmin"
        assert user.is_verified

    def test_user_str(self, user):
        assert str(user) == f"{user.get_full_name()} ({user.email})"

    def test_get_full_name(self, user):
        assert user.get_full_name() == "Test User"

    def test_email_required(self):
        with pytest.raises(ValueError, match="Email is required"):
            User.objects.create_user(email="", password="Test@1234")

    def test_email_unique(self, user, user_data):
        with pytest.raises(Exception):
            User.objects.create_user(**user_data)
