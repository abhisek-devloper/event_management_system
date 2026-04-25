import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Events API
export const eventsAPI = {
  getAllEvents: (params) => api.get('/events/', { params }),
  getEventDetail: (id) => api.get(`/events/${id}/`),
  createEvent: (data) => api.post('/events/', data),
  updateEvent: (id, data) => api.put(`/events/${id}/`, data),
  deleteEvent: (id) => api.delete(`/events/${id}/`),
  searchEvents: (query) => api.get('/events/search/', { params: { q: query } }),
  getUpcomingEvents: () => api.get('/events/upcoming/'),
  getMyEvents: () => api.get('/events/my_events/'),
  getEventRegistrations: (id) => api.get(`/events/${id}/registrations/`),
};

// Registrations API
export const registrationsAPI = {
  registerForEvent: (data) => api.post('/registrations/', data),
  getRegistrationsByEmail: (email) => api.get('/registrations/by_email/', { params: { email } }),
  getRegistrationsByEvent: (eventId) => api.get('/registrations/by_event/', { params: { event_id: eventId } }),
  checkRegistration: (eventId, email) => api.post('/registrations/check_registration/', { event_id: eventId, email }),
};

// Users API
export const usersAPI = {
  register: (data) => api.post('/users/register/', data),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/update/', data),
  login: (username, password) => api.post('/token/', { username, password }),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
};

export default api;
