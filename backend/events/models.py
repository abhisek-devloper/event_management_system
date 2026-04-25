from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    """Event model for managing events"""
    EVENT_TYPES = [
        ('conference', 'Conference'),
        ('workshop', 'Workshop'),
        ('webinar', 'Webinar'),
        ('meetup', 'Meetup'),
        ('seminar', 'Seminar'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateTimeField()
    type = models.CharField(max_length=20, choices=EVENT_TYPES)
    location = models.CharField(max_length=255, blank=True)
    capacity = models.IntegerField(default=100)
    image = models.ImageField(upload_to='events/', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['type']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return self.title

    @property
    def registration_count(self):
        return self.registrations.count()

    @property
    def available_seats(self):
        return self.capacity - self.registration_count
