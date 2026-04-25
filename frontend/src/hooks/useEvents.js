import { useState, useCallback } from 'react';
import { eventsAPI } from '../services/api';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  const fetchEvents = useCallback(async (page = 1, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsAPI.getAllEvents({ page, ...params });
      setEvents(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchEvents = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsAPI.searchEvents(query);
      setEvents(response.data);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUpcomingEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsAPI.getUpcomingEvents();
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch upcoming events');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    events,
    loading,
    error,
    pagination,
    fetchEvents,
    searchEvents,
    getUpcomingEvents,
  };
};
