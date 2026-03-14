import { useState, useEffect, useCallback } from 'react';
import { eventsApi } from '../api/events';
import { Event } from '../types';
import { useToast } from '../context/ToastContext';

export const useUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchUpcomingEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsApi.getUpcoming();
      setEvents(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch upcoming events');
      showToast(err.response?.data?.message || 'Failed to fetch upcoming events', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUpcomingEvents();
  }, [fetchUpcomingEvents]);

  return { events, loading, error, refetch: fetchUpcomingEvents };
};