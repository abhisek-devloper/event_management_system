# 🛠️ Event Management System - Developer Master Guide

This is the comprehensive guide for developers, merging all project documentation.

**Briefly inside this document:**
- **Quick Start:** 5-minute manual and Docker setup instructions for both frontend and backend.
- **Project Structure:** An overview of the directories (Django apps, React components, etc.).
- **Installation & Deployment:** Requirements and deployment tips for hosting services.
- **API Reference Summary:** High-level overview of core authentication, event, and registration endpoints.
- **Best Practices:** Details on newly added features like Global Dark/Light Theme, duplicate prevention, and strict login requirements for event access.

---

## 🌟 Introduction
The Event Management System is a full-stack application built with Django and React. It allows users to browse events, create their own, and register for others with built-in duplicate prevention.

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Manual Setup
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend (New terminal)
cd frontend
npm install
npm run dev
```

### Option 2: Docker Setup
```bash
docker-compose up --build -d
```

---

## 📋 Project Structure

```
.
├── backend/            # Django REST API
│   ├── events/         # Event management app
│   ├── registrations/  # Event registration app
│   └── users/          # Custom user and auth app
├── frontend/           # React Application
│   ├── src/components/ # Reusable UI
│   └── src/pages/      # Route pages
└── docs/               # (Legacy) Consolidated into this file
```

---

## ⚙️ Detailed Installation & Deployment

### Backend Requirements
- Python 3.11+
- Environment variables: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`

### Frontend Requirements
- Node.js 18+
- Environment variables: `VITE_API_URL`

### Deployment
- **Backend:** Can be deployed to Render, Heroku, or any Python host.
- **Frontend:** Can be deployed to Vercel, Netlify, or as static files.

---

## 📡 API Reference Summary

### Auth Endpoints
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Refresh session

### Event Endpoints
- `GET /api/events/` - List events
- `POST /api/events/` - Create event (Auth required)
- `GET /api/events/{id}/` - Event detail
- `GET /api/events/{id}/registrations/` - List participants (Creator only)

### Registration Endpoints
- `POST /api/registrations/` - Register for event
- `POST /api/registrations/check_registration/` - Check status

---

## ✅ Best Practices & Validation
- **Duplicate Prevention:** Handled at database level (`unique_together`) and serializer level.
- **Auth:** JWT tokens with 1-hour expiration.
- **Theme:** Persistent Dark/Light mode support.

---

## 📚 Related Files
- [BACKEND_API.md](BACKEND_API.md) - Deep dive into API and Backend
- [FRONTEND_USAGE.md](FRONTEND_USAGE.md) - Deep dive into Frontend usage
