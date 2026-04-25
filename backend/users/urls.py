from django.urls import path
from .views import UserViewSet

urlpatterns = [
    path('register/', UserViewSet.as_view({'post': 'register'}), name='user-register'),
    path('profile/', UserViewSet.as_view({'get': 'profile'}), name='user-profile'),
    path('profile/update/', UserViewSet.as_view({'put': 'update_profile'}), name='user-update-profile'),
]
