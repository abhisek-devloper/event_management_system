from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event
from .serializers import EventSerializer, EventCreateUpdateSerializer

class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for managing events"""
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'date']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EventCreateUpdateSerializer
        return EventSerializer

    def get_permissions(self):
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if self.get_object().created_by != self.request.user:
            return Response(
                {'detail': 'You can only edit your own events.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()

    def perform_destroy(self, instance):
        if instance.created_by != self.request.user:
            return Response(
                {'detail': 'You can only delete your own events.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()

    @action(detail=True, methods=['get'])
    def registrations(self, request, pk=None):
        """Get all registrations for an event (Creator only)"""
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        event = self.get_object()
        
        # Only the creator can see the registrations
        if event.created_by != request.user:
            return Response(
                {'detail': 'Only the event creator can view participant list.'},
                status=status.HTTP_403_FORBIDDEN
            )

        registrations = event.registrations.all()
        data = {
            'event': EventSerializer(event).data,
            'registrations': [
                {
                    'id': reg.id,
                    'name': reg.name,
                    'email': reg.email,
                    'phone': reg.phone,
                    'registered_at': reg.created_at
                }
                for reg in registrations
            ]
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def my_events(self, request):
        """Get events created by the authenticated user"""
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        events = Event.objects.filter(created_by=request.user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming events"""
        from django.utils import timezone
        events = Event.objects.filter(date__gte=timezone.now()).order_by('date')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search events by title, description, or location"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'detail': 'Search query is required.'}, status=status.HTTP_400_BAD_REQUEST)

        events = Event.objects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query) |
            Q(location__icontains=query)
        )
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)
