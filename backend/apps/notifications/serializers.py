from rest_framework import serializers

from .models import Notification, NotificationTemplate


class NotificationSerializer(serializers.ModelSerializer):
    is_read = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = (
            "id", "recipient", "channel", "subject", "body",
            "sent", "sent_at", "read_at", "is_read",
            "error_message", "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "recipient", "sent", "sent_at", "is_read",
            "error_message", "created_at", "updated_at",
        )


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("recipient", "channel", "subject", "body")


class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = (
            "id", "code", "name", "channel", "subject", "body",
            "is_active", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
