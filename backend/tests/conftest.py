import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def user_data():
    return {
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "Test@1234",
    }


@pytest.fixture
def user(user_data):
    return User.objects.create_user(**user_data)


@pytest.fixture
def super_user():
    return User.objects.create_superuser(
        email="admin@example.com",
        password="Admin@1234",
        first_name="Admin",
        last_name="User",
    )
