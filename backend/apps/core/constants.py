SYSTEM_ROLES = (
    ("superadmin", "SuperAdmin"),
    ("admin", "Admin"),
    ("manager", "Manager"),
    ("operator", "Operator"),
    ("client", "Client"),
)

AUDIT_ACTIONS = (
    ("login", "Login"),
    ("logout", "Logout"),
    ("create", "Create"),
    ("update", "Update"),
    ("delete", "Delete"),
    ("permission_change", "Permission Change"),
    ("email_verification_requested", "Email Verification Requested"),
    ("email_verified", "Email Verified"),
)

NOTIFICATION_CHANNELS = (
    ("email", "Email"),
    ("sms", "SMS"),
    ("whatsapp", "WhatsApp"),
    ("push", "Push"),
)

PAGINATION_MIN_PAGE_SIZE = 10
PAGINATION_MAX_PAGE_SIZE = 100
PAGINATION_DEFAULT_PAGE_SIZE = 25
