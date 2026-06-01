from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin

from .forms import UserAdminChangeForm, UserAdminCreationForm
from .models import User


@admin.register(User)
class UserAdmin(ModelAdmin, BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm
    list_display = ("email", "first_name", "last_name", "role", "is_verified", "is_active", "is_staff")
    list_filter = ("role", "is_verified", "is_active", "is_staff", "is_superuser")
    search_fields = ("email", "first_name", "last_name", "phone")
    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions")
    list_per_page = 25

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Informações Pessoais", {"fields": ("first_name", "last_name", "phone", "avatar")}),
        ("Permissões", {"fields": ("role", "is_active", "is_staff", "is_superuser", "is_verified", "is_mfa_enabled", "groups", "user_permissions")}),
        ("Datas", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    readonly_fields = ("last_login", "created_at", "updated_at")

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "password1", "password2", "role"),
        }),
    )
