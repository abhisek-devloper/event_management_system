from django.db import models
from django.contrib.auth import get_user_model
from events.models import Event

User = get_user_model()

class Registration(models.Model):
    """Registration model for managing user registrations to events"""
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='registrations')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('event', 'email')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event', 'email']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return f"{self.name} - {self.event.title}"
