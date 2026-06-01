from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(ModelAdmin):
    list_display = ("action", "model_name", "model_id", "performed_by", "created_at")
    list_filter = ("action", "model_name", "created_at")
    search_fields = ("model_name", "model_id", "description")
    readonly_fields = ("action", "model_name", "model_id", "performed_by", "description", "changes", "ip_address", "created_at")
    list_per_page = 50

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        if obj:
            return False
        return super().has_change_permission(request, obj)
