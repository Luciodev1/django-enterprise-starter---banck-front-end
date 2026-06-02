from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import permissions
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.audit.models import AuditLog
from apps.core.permissions import IsAdmin, IsAuthenticated
from apps.notifications.models import Notification

User = get_user_model()


class DashboardStatsAPIView(APIView):
    """
    Estatísticas agregadas para o dashboard.
    - Admin/Manager: visão global.
    - Operator/Client: visão reduzida (próprias notificações e acções).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        is_admin = user.role in ("superadmin", "admin", "manager")

        now = timezone.now()
        last_30 = now - timedelta(days=30)
        last_7 = now - timedelta(days=7)

        if is_admin:
            users_qs = User.objects.all()
            audit_qs = AuditLog.objects.all()
            notif_qs = Notification.objects.all()
        else:
            users_qs = User.objects.filter(id=user.id)
            audit_qs = AuditLog.objects.filter(performed_by=user)
            notif_qs = Notification.objects.filter(recipient=user)

        users_total = users_qs.count()
        users_active = users_qs.filter(is_active=True).count()
        users_new_30 = users_qs.filter(created_at__gte=last_30).count()

        users_by_role = list(users_qs.values("role").annotate(count=Count("id")))

        audit_total = audit_qs.count()
        audit_recent_7 = audit_qs.filter(created_at__gte=last_7).count()
        audit_by_action = list(audit_qs.values("action").annotate(count=Count("id")).order_by("-count")[:5])

        notif_total = notif_qs.count()
        notif_unread = notif_qs.filter(read_at__isnull=True).count()
        notif_by_channel = list(notif_qs.values("channel").annotate(count=Count("id")))

        # timeseries para gráficos (últimos 30 dias)
        users_timeseries = list(
            users_qs.filter(created_at__gte=last_30)
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )
        audit_timeseries = list(
            audit_qs.filter(created_at__gte=last_30)
            .annotate(date=TruncDate("created_at"))
            .values("date")
            .annotate(count=Count("id"))
            .order_by("date")
        )

        return Response(
            {
                "users": {
                    "total": users_total,
                    "active": users_active,
                    "inactive": users_total - users_active,
                    "new_last_30": users_new_30,
                    "by_role": {item["role"]: item["count"] for item in users_by_role},
                },
                "audit": {
                    "total": audit_total,
                    "recent_7": audit_recent_7,
                    "by_action": {item["action"]: item["count"] for item in audit_by_action},
                },
                "notifications": {
                    "total": notif_total,
                    "unread": notif_unread,
                    "by_channel": {item["channel"]: item["count"] for item in notif_by_channel},
                },
                "timeseries": {
                    "users_30d": [
                        {"date": item["date"].isoformat(), "count": item["count"]}
                        for item in users_timeseries
                    ],
                    "audit_30d": [
                        {"date": item["date"].isoformat(), "count": item["count"]}
                        for item in audit_timeseries
                    ],
                },
            }
        )


class HealthCheckAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    renderer_classes = [JSONRenderer]  # Plain JSON, bypass StandardJSONRenderer wrapper

    def get(self, request):
        from django.db import connection
        from django.core.cache import cache

        db_ok = True
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
        except Exception:
            db_ok = False

        cache_ok = True
        try:
            cache.set("healthcheck", "ok", 5)
            cache_ok = cache.get("healthcheck") == "ok"
        except Exception:
            cache_ok = False

        return Response(
            {
                "status": "ok" if (db_ok and cache_ok) else "degraded",
                "database": "ok" if db_ok else "error",
                "cache": "ok" if cache_ok else "error",
                "service": "django-enterprise-starter",
                "version": "1.0.0",
            }
        )
