from rest_framework.renderers import JSONRenderer


class StandardJSONRenderer(JSONRenderer):
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get("response") if renderer_context else None
        if response and response.status_code >= 400:
            return super().render(
                {"success": False, "message": "Request failed", "errors": data},
                accepted_media_type, renderer_context,
            )
        return super().render(
            {"success": True, "message": "Success", "data": data},
            accepted_media_type, renderer_context,
        )
