from django.http import JsonResponse

def api_root(request):
    """
    Root view for the Event Management API.
    """
    return JsonResponse({
        "name": "Event Management API",
        "version": "1.0.0",
        "status": "Running",
        "endpoints": {
            "admin": "/admin/",
            "auth": {
                "token_obtain": "/api/token/",
                "token_refresh": "/api/token/refresh/"
            },
            "users": {
                "register": "/api/users/register/",
                "profile": "/api/users/profile/",
                "update_profile": "/api/users/profile/update/"
            },
            "events": "/api/events/",
            "registrations": "/api/registrations/"
        }
    })
