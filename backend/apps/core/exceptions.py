from rest_framework.views import exception_handler


def standard_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        errors = response.data
        response.data = {
            "success": False,
            "message": _get_error_message(errors),
            "errors": errors,
        }
    return response


def _get_error_message(errors):
    if isinstance(errors, dict):
        for field, msgs in errors.items():
            if isinstance(msgs, list) and len(msgs) > 0:
                return str(msgs[0])
            return str(msgs)
    if isinstance(errors, list) and len(errors) > 0:
        return str(errors[0])
    return "An unexpected error occurred"
