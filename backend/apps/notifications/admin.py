from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(ModelAdmin):
    list_display = ("subject", "recipient", "channel", "sent", "sent_at", "created_at")
    list_filter = ("channel", "sent", "created_at")
    search_fields = ("subject", "body", "recipient__email")
    readonly_fields = ("sent_at", "created_at")
    list_per_page = 25
