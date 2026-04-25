# ⚙️ Event Management System - Backend & API Guide

This document provides comprehensive information for backend developers and API consumers. All URLs are relative to the base URL (e.g., `http://localhost:8000`).

**Briefly inside this document:**
- **Backend Setup:** Instructions to set up the Django environment and run migrations.
- **Authentication:** Details on JWT token login and refresh endpoints.
- **User Management:** Endpoints for user registration, profile retrieval, and updating (ensure trailing slash for `/api/users/profile/update/`).
- **Event Endpoints:** Complete list of CRUD operations for events, search, filtering, and upcoming events.
- **Registration Endpoints:** Enforced authentication required for registering to events, preventing creator registration, and unique per-user constraint.
- **Status Codes & Tech Stack:** Reference for HTTP codes and backend technologies used.

---

## 🛠️ Backend Setup & Installation

### Prerequisites
- Python 3.11+
- pip (Python package manager)
- Virtual environment tool

### Quick Start (Manual)
1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Start development server:**
   ```bash
   python manage.py runserver
   ```

---

## 🔐 Authentication Endpoints

### JWT Token Authentication
All authenticated endpoints require the `Authorization` header:
```http
Authorization: Bearer <access_token>
```

### 1. Login (Get Tokens)
**URL:** `/api/token/`
**Method:** `POST`
**Authentication:** None

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```
**Response (200 OK):**
```json
{
  "access": "eyJhbGciOi...",
  "refresh": "eyJhbGciOi..."
}
```

### 2. Refresh Token
**URL:** `/api/token/refresh/`
**Method:** `POST`
**Authentication:** None

**Request Body:**
```json
{
  "refresh": "eyJhbGciOi..."
}
```
**Response (200 OK):**
```json
{
  "access": "eyJhbGciOi..."
}
```

---

## 👥 User Management Endpoints

### 1. Register New User
**URL:** `/api/users/register/`
**Method:** `POST`
**Authentication:** None

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "secure_password_123",
  "password_confirm": "secure_password_123"
}
```
**Response (201 Created):**
```json
{
  "message": "User registered successfully."
}
```

### 2. Get User Profile
**URL:** `/api/users/profile/`
**Method:** `GET`
**Authentication:** Required

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

### 3. Update User Profile
**URL:** `/api/users/profile/update/`
**Method:** `PUT`
**Authentication:** Required

**Request Body (All fields optional):**
```json
{
  "first_name": "Johnny"
}
```
**Response (200 OK):** Returns the updated user object.

---

## 📅 Event Management Endpoints

### 1. List All Events
**URL:** `/api/events/`
**Method:** `GET`
**Authentication:** Required
**Query Parameters:**
- `page` (int): Page number (e.g., `?page=2`)
- `type` (string): Filter by type (e.g., `?type=workshop`)
- `search` (string): Search in title/description (e.g., `?search=react`)
- `ordering` (string): Order results (e.g., `?ordering=-date`)

**Response (200 OK):**
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/events/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "React Workshop",
      "description": "Learn React",
      "date": "2024-12-31T23:59:59Z",
      "type": "workshop",
      "location": "Online",
      "capacity": 50,
      "available_seats": 20,
      "created_by_username": "john_doe"
    }
  ]
}
```

### 2. Create Event
**URL:** `/api/events/`
**Method:** `POST`
**Authentication:** Required

**Request Body:**
```json
{
  "title": "AI Workshop",
  "description": "Intro to AI",
  "date": "2024-12-31T23:59:59Z",
  "type": "workshop",
  "location": "Remote",
  "capacity": 50
}
```
**Response (201 Created):** Returns the created event object.

### 3. Get Event Details
**URL:** `/api/events/{id}/`
**Method:** `GET`
**Authentication:** Required

**Response (200 OK):** Returns the detailed event object.

### 4. Update Event
**URL:** `/api/events/{id}/`
**Method:** `PUT` / `PATCH`
**Authentication:** Required (Must be Event Creator)

**Request Body:** (Any fields to update)
```json
{
  "capacity": 100
}
```
**Response (200 OK):** Returns the updated event object.

### 5. Delete Event
**URL:** `/api/events/{id}/`
**Method:** `DELETE`
**Authentication:** Required (Must be Event Creator)

**Response (204 No Content):** Empty body.

### 6. Get Upcoming Events
**URL:** `/api/events/upcoming/`
**Method:** `GET`
**Authentication:** Required

**Response (200 OK):** Returns a list of events where the date is in the future.

### 7. Get My Events
**URL:** `/api/events/my_events/`
**Method:** `GET`
**Authentication:** Required

**Response (200 OK):** Returns a list of events created by the authenticated user.

### 8. Search Events
**URL:** `/api/events/search/`
**Method:** `GET`
**Authentication:** Required
**Query Parameters:**
- `q` (string, required): Search term

**Response (200 OK):** Returns a list of matching events.

### 9. Get Event Registrations (Creator Only)
**URL:** `/api/events/{id}/registrations/`
**Method:** `GET`
**Authentication:** Required (Must be Event Creator)

**Response (200 OK):**
```json
{
  "event": { /* event details */ },
  "registrations": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "1234567890",
      "registered_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

---

## 📝 Event Registration Endpoints

### 1. Register for Event
**URL:** `/api/registrations/`
**Method:** `POST`
**Authentication:** Required

**Request Body:**
```json
{
  "event": 1,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890"
}
```
**Response (201 Created):**
```json
{
  "message": "Successfully registered for the event.",
  "registration": { /* details */ }
}
```
*(Duplicate email or account will return a 400 Bad Request error)*

### 2. Get Registrations by Email
**URL:** `/api/registrations/by_email/`
**Method:** `GET`
**Authentication:** Required
**Query Parameters:**
- `email` (string, required): User email

**Response (200 OK):** Returns a list of registrations for that email.

### 3. Get Registrations by Event
**URL:** `/api/registrations/by_event/`
**Method:** `GET`
**Authentication:** Required
**Query Parameters:**
- `event_id` (int, required): Event ID

**Response (200 OK):** Returns a list of registrations for that event.

### 4. Check Registration Status
**URL:** `/api/registrations/check_registration/`
**Method:** `POST`
**Authentication:** Required

**Request Body:**
```json
{
  "event_id": 1,
  "email": "jane@example.com"
}
```
**Response (200 OK):**
```json
{
  "event_id": 1,
  "email": "jane@example.com",
  "is_registered": true
}
```

---

## 🔄 Status Codes Reference
| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Validation error or missing fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Not allowed (e.g., modifying another user's event) |
| 404 | Not Found | Resource does not exist |

---

## 🔗 Technologies
- **Django 4.2.7**
- **Django REST Framework**
- **JWT (SimpleJWT)**
- **SQLite / PostgreSQL**
