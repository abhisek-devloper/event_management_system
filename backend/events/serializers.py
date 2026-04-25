from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    registration_count = serializers.SerializerMethodField()
    available_seats = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'description', 'date', 'type', 'location',
            'capacity', 'image', 'created_by', 'created_by_username', 'created_by_email',
            'registration_count', 'available_seats', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_by', 'created_at', 'updated_at')

    def get_registration_count(self, obj):
        return obj.registration_count

    def get_available_seats(self, obj):
        return obj.available_seats

class EventCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'date', 'type', 'location', 'capacity', 'image')
        read_only_fields = ('id',)

    def validate_date(self, value):
        from django.utils import timezone
        if value < timezone.now():
            raise serializers.ValidationError("Event date cannot be in the past.")
        return value

    def validate_capacity(self, value):
        if value < 1:
            raise serializers.ValidationError("Event capacity must be at least 1.")
        return value

    def validate(self, data):
        title = data.get('title')
        date = data.get('date')
        user = self.context['request'].user

        # Check for duplicate event by same user
        if Event.objects.filter(title=title, date=date, created_by=user).exists():
            raise serializers.ValidationError(
                "You have already created an event with this title and date."
            )

        return data
