from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class UserAdminCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("email", "first_name", "last_name")


class UserAdminChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = "__all__"
