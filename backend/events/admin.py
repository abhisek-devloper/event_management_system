from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'type', 'created_by', 'registration_count', 'created_at')
    list_filter = ('type', 'date', 'created_at')
    search_fields = ('title', 'description', 'location')
    readonly_fields = ('created_at', 'updated_at', 'registration_count')
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'description', 'type', 'date', 'location', 'capacity', 'image')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at', 'registration_count'),
            'classes': ('collapse',)
        }),
    )
