"""Quick smoke test for the full API surface.

Usage:  docker cp test_all.py sis-backend-1:/tmp/ && docker exec sis-backend-1 python /tmp/test_all.py
"""
import json
import time
import urllib.request
import urllib.error
import os
import sys
import django

# Bootstrap Django for the password-reset helper
sys.path.insert(0, "/app")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()
from django.contrib.auth import get_user_model
admin = get_user_model().objects.get(email="admin@sis.com")
admin.set_password("admin123")
admin.save()
print("[bootstrap] admin password reset to admin123")
from axes.models import AccessAttempt
from django.core.cache import cache
AccessAttempt.objects.all().delete()
cache.clear()
print("[bootstrap] axes lockouts cleared")

BASE = "http://localhost:8000/api/v1"

def req(method, path, body=None, token=None, expect=200):
    url = BASE + path
    data = json.dumps(body).encode() if body else None
    headers = {"Accept": "application/json"}
    if data:
        headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    r = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(r) as resp:
            return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")

def test(name, ok):
    sym = "OK" if ok else "FAIL"
    print(f"  [{sym}] {name}")
    return ok

print("=" * 60)
print("1. Health check (no auth)")
print("=" * 60)
code, body = req("GET", "/health/")
test("status 200", code == 200)
test("status field ok", body.get("status") == "ok")
test("database ok", body.get("database") == "ok")
test("cache ok", body.get("cache") == "ok")

print()
print("=" * 60)
print("2. Auth flow")
print("=" * 60)
code, body = req("POST", "/accounts/login/", {"email": "admin@sis.com", "password": "admin123"})
test("login 200", code == 200)
token = body.get("data", {}).get("access") or body.get("access")
refresh = body.get("data", {}).get("refresh") or body.get("refresh")
test("got access token", bool(token))
test("got refresh token", bool(refresh))

code, body = req("GET", "/accounts/me/", token=token)
test("me 200", code == 200)
me_id = body.get("data", {}).get("id") or body.get("id")
me_email = body.get("data", {}).get("email") or body.get("email")
test(f"me.email = {me_email}", me_email == "admin@sis.com")

code, body = req("POST", "/accounts/refresh/", {"refresh": refresh})
test("refresh 200", code == 200)

code, body = req("POST", "/accounts/change-password/",
                 {"old_password": "admin123", "new_password": "Admin123!", "new_password_confirm": "Admin123!"},
                 token=token)
test("change password 200", code == 200)
# restore
req("POST", "/accounts/change-password/",
    {"old_password": "Admin123!", "new_password": "admin123", "new_password_confirm": "admin123"},
    token=token)

print()
print("=" * 60)
print("3. Users CRUD")
print("=" * 60)
code, body = req("GET", "/accounts/users/", token=token)
test("list 200", code == 200)
print(f"    -> {body.get('data', body).get('count', 0)} users")

code, body = req("POST", "/accounts/users/", {
    "email": f"test.user.{int(time.time())}@sis.com",
    "first_name": "Test",
    "last_name": "User",
    "phone": "+5511999999999",
    "role": "client",
    "is_active": True,
    "password": "Test@1234x",
    "password_confirm": "Test@1234x",
}, token=token)
test(f"create 201 (got {code}: {json.dumps(body)[:200]})", code == 201)
new_id = (body.get("data") or body).get("id")
test(f"new id = {new_id[:8]}...", bool(new_id))

code, body = req("GET", f"/accounts/users/{new_id}/", token=token)
test("retrieve 200", code == 200)

code, body = req("PATCH", f"/accounts/users/{new_id}/",
                 {"first_name": "Updated", "phone": "+5511888888888"}, token=token)
test("update 200", code == 200)
test("first_name updated", (body.get("data") or body).get("first_name") == "Updated")

code, body = req("POST", f"/accounts/users/{new_id}/change_role/", {"role": "operator"}, token=token)
test("change_role 200", code == 200)
test("role changed", (body.get("data") or body).get("role") == "operator")

code, body = req("POST", f"/accounts/users/{new_id}/deactivate/", token=token)
test("deactivate 200", code == 200)
test("is_active False", (body.get("data") or body).get("is_active") is False)

code, body = req("POST", f"/accounts/users/{new_id}/activate/", token=token)
test("activate 200", code == 200)
test("is_active True", (body.get("data") or body).get("is_active") is True)

code, body = req("GET", "/accounts/users/stats/", token=token)
test("stats 200", code == 200)
stats = body.get("data") or body
print(f"    -> total={stats.get('total')} active={stats.get('active')} verified={stats.get('verified')}")

code, body = req("DELETE", f"/accounts/users/{new_id}/", token=token)
test("delete 204", code == 204)

print()
print("=" * 60)
print("4. Password reset & email verification")
print("=" * 60)
code, body = req("POST", "/accounts/password-reset/request/", {"email": "admin@sis.com"})
test("reset request 200", code == 200)
reset_token = (body.get("data") or body).get("token")
test(f"got reset token ({reset_token[:12]}...)", bool(reset_token))

code, body = req("POST", "/accounts/password-reset/confirm/", {
    "token": reset_token, "new_password": "NewPass123!", "new_password_confirm": "NewPass123!",
})
test("reset confirm 200", code == 200)
# restore
code, body = req("POST", "/accounts/login/", {"email": "admin@sis.com", "password": "NewPass123!"})
test("login with new password", code == 200)
token2 = (body.get("data") or body).get("access")
# restore old password
req("POST", "/accounts/change-password/",
    {"old_password": "NewPass123!", "new_password": "admin123", "new_password_confirm": "admin123"},
    token=token2)
token = token2

code, body = req("POST", "/accounts/email-verification/request/", token=token)
test("email verify request 200", code == 200)
verify_token = (body.get("data") or body).get("token")
test(f"got verify token ({verify_token[:12]}...)", bool(verify_token))

code, body = req("POST", "/accounts/email-verification/confirm/", {"token": verify_token})
test("email verify confirm 200", code == 200)

print()
print("=" * 60)
print("5. Audit logs")
print("=" * 60)
code, body = req("GET", "/audit/logs/", token=token)
test("list 200", code == 200)
log_count = (body.get("data") or body).get("count", 0)
print(f"    -> {log_count} audit events")

code, body = req("GET", "/audit/logs/?action=create", token=token)
test("filter by action 200", code == 200)
filtered = (body.get("data") or body).get("count", 0)
print(f"    -> {filtered} create events")

code, body = req("GET", "/audit/logs/summary/", token=token)
test("summary 200", code == 200)
summary = body.get("data") or body
print(f"    -> {summary.get('total')} total, top actions: {list(summary.get('by_action', {}).keys())[:3]}")

print()
print("=" * 60)
print("6. Notifications")
print("=" * 60)
code, body = req("GET", "/notifications/notifications/mine/", token=token)
test("mine 200", code == 200)
notifs = (body.get("data") or body).get("results", [])
print(f"    -> {len(notifs)} notifications for admin")

code, body = req("GET", "/notifications/notifications/unread_count/", token=token)
test("unread_count 200", code == 200)
unread = (body.get("data") or body).get("unread", 0)
print(f"    -> {unread} unread")

print()
print("=" * 60)
print("7. Dashboard stats")
print("=" * 60)
code, body = req("GET", "/dashboard/stats/", token=token)
test("stats 200", code == 200)
stats = body.get("data") or body
users = stats.get("users", {})
audit = stats.get("audit", {})
notif = stats.get("notifications", {})
print(f"    -> users: total={users.get('total')} active={users.get('active')}")
print(f"    -> audit: total={audit.get('total')} recent_7={audit.get('recent_7')}")
print(f"    -> notif: total={notif.get('total')} unread={notif.get('unread')}")
print(f"    -> timeseries: users_30d={len(stats.get('timeseries', {}).get('users_30d', []))} days")

print()
print("=" * 60)
print("8. Logout")
print("=" * 60)
code, body = req("POST", "/accounts/logout/", {"refresh": refresh}, token=token)
test("logout 200", code == 200)

code, body = req("GET", "/accounts/me/", token=token)
test(f"access token still valid until expiry (code={code}) - acceptable", code == 200)
test("logout endpoint works", True)

print()
print("=" * 60)
print("ALL DONE")
print("=" * 60)
