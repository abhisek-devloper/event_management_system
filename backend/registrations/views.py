from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Registration
from .serializers import RegistrationSerializer, RegistrationCreateSerializer

class RegistrationViewSet(viewsets.ModelViewSet):
    """ViewSet for managing event registrations"""
    queryset = Registration.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegistrationCreateSerializer
        return RegistrationSerializer

    def create(self, request, *args, **kwargs):
        """Register a user for an event"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=self.request.user)
            return Response(
                {
                    'message': 'Successfully registered for the event.',
                    'registration': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def by_email(self, request):
        """Get registrations by email"""
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'detail': 'Email parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        registrations = Registration.objects.filter(email=email)
        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_event(self, request):
        """Get registrations for a specific event"""
        event_id = request.query_params.get('event_id')
        if not event_id:
            return Response(
                {'detail': 'Event ID parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        registrations = Registration.objects.filter(event_id=event_id)
        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def check_registration(self, request):
        """Check if an email is already registered for an event"""
        event_id = request.data.get('event_id')
        email = request.data.get('email')

        if not event_id or not email:
            return Response(
                {'detail': 'Event ID and email are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        exists = Registration.objects.filter(event_id=event_id, email=email).exists()
        
        # Also check by user if authenticated
        if not exists and request.user.is_authenticated:
            exists = Registration.objects.filter(event_id=event_id, user=request.user).exists()
            
        return Response({
            'event_id': event_id,
            'email': email,
            'is_registered': exists
        })
