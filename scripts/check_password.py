from django.contrib.auth import get_user_model
u = get_user_model().objects.get(email='admin@sis.com')
ok = u.check_password('admin123')
print(f"admin123 works: {ok}")
if not ok:
    u.set_password('admin123')
    u.save()
    print("Password reset to admin123")
