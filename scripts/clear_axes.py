from axes.models import AccessAttempt
from django.core.cache import cache
AccessAttempt.objects.all().delete()
cache.clear()
print("OK - cleared axes and cache")
