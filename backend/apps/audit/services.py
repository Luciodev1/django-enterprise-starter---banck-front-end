from .models import AuditLog


class AuditService:
    @staticmethod
    def log(action, model_name, model_id="", performed_by=None, description="", changes=None, ip_address=None):
        return AuditLog.objects.create(
            action=action,
            model_name=model_name,
            model_id=str(model_id) if model_id else "",
            performed_by=performed_by,
            description=description,
            changes=changes or {},
            ip_address=ip_address,
        )
