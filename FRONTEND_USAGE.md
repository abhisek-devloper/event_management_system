# 💻 Event Management System - Frontend Guide

This document provides information for frontend developers and instructions on how to use the UI.

**Briefly inside this document:**
- **Frontend Setup:** Environment configuration and dev server start commands.
- **Key Features:** Overview of capabilities including strict event access (login required to view details and register), Global Dark/Light theme, and duplicate registration prevention.
- **Project Structure:** Details on React components, pages, custom hooks (like `useTheme`), and context providers.
- **Tech Stack:** Information on React 18, Vite, Tailwind CSS, and Axios.

---

## 🛠️ Frontend Setup & Installation

### Prerequisites
- Node.js 18+
- npm or pnpm

### Quick Start
1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `.env.local` with:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

---

## 🚀 Key Features

### Browse Events
- View all upcoming events on the home page.
- Search by title, description, or location.
- Filter by event type (Conference, Workshop, etc.).

### User Authentication
- Register for a new account.
- Login to access creator features.
- Persistent session using JWT stored in localStorage.

### Event Creation
- Logged-in users can create new events.
- Upload images and set capacity.

### Event Registration
- **Strict Access Control:** Only authenticated, logged-in users can view event details and register.
- **Creator Restriction:** Event creators are prevented from registering for their own events.
- **Duplicate Prevention:** The system restricts users to a single registration per event.

---

## 📂 Project Structure (Frontend)
- `src/components/` - Reusable UI elements (Navbar, EventCard, etc.)
- `src/pages/` - Page-level components (Home, EventDetail, CreateEvent)
- `src/hooks/` - Custom React hooks (useAuth, useTheme)
- `src/services/` - Axios API client configurations
- `src/context/` - Auth and Theme context providers

---

## 🛠️ Tech Stack
- **React 18**
- **Vite**
- **Tailwind CSS**
- **React Router Dom**
- **Axios**
