from django.contrib import admin
from .models import Registration

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'event', 'created_at')
    list_filter = ('event', 'created_at')
    search_fields = ('name', 'email', 'event__title')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Registration Information', {
            'fields': ('event', 'name', 'email', 'phone')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
