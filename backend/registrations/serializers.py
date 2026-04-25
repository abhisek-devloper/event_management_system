from rest_framework import serializers
from .models import Registration
from events.models import Event
from django.core.exceptions import ValidationError

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ('id', 'event', 'name', 'email', 'phone', 'created_at')
        read_only_fields = ('id', 'created_at')

class RegistrationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ('event', 'name', 'email', 'phone', 'user')
        extra_kwargs = {
            'user': {'required': False}
        }

    def validate(self, data):
        event = data.get('event')
        email = data.get('email')
        # Get user from data or from request context
        user = data.get('user') or self.context.get('request').user
        if user and not user.is_authenticated:
            user = None

        # Check if person registering is the creator
        if event.created_by.email == email or (user and event.created_by == user):
            raise serializers.ValidationError(
                "Creators cannot register for their own events."
            )

        # Check for duplicate registration by email
        if Registration.objects.filter(event=event, email=email).exists():
            raise serializers.ValidationError(
                "This email is already registered for this event."
            )

        # Check for duplicate registration by user account
        if user and Registration.objects.filter(event=event, user=user).exists():
            raise serializers.ValidationError(
                "You have already registered for this event."
            )

        # Check if event capacity is reached
        if event.available_seats <= 0:
            raise serializers.ValidationError(
                "This event is full and no longer accepting registrations."
            )

        return data

    def validate_email(self, value):
        if '@' not in value or '.' not in value.split('@')[1]:
            raise serializers.ValidationError("Enter a valid email address.")
        return value

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value
