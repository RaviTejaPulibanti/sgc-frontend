import { useState, useEffect, useCallback } from 'react';
import { eventsApi } from '../api/events';
import { Event, EventFilters } from '../types';
import { useToast } from '../context/ToastContext';

export const useEvents = (initialFilters?: EventFilters) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    pages: 1,
    total: 0,
  });

  const { showToast } = useToast();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsApi.getAll(filters);
      setEvents(response.data);
      setPagination({
        count: response.count,
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || response.count,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
      showToast(err.response?.data?.message || 'Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (formData: FormData) => {
    try {
      const response = await eventsApi.create(formData);
      showToast('Event created successfully', 'success');
      fetchEvents();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create event', 'error');
      throw err;
    }
  };

  const updateEvent = async (id: string, formData: FormData) => {
    try {
      const response = await eventsApi.update(id, formData);
      showToast('Event updated successfully', 'success');
      fetchEvents();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update event', 'error');
      throw err;
    }
  };

  const addPostEvent = async (id: string, formData: FormData) => {
    try {
      const response = await eventsApi.addPostEvent(id, formData);
      showToast('Post-event details added successfully', 'success');
      fetchEvents();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add post-event details', 'error');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventsApi.delete(id);
      showToast('Event deleted successfully', 'success');
      fetchEvents();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete event', 'error');
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    fetchEvents,
    createEvent,
    updateEvent,
    addPostEvent,
    deleteEvent,
  };
};

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await eventsApi.getById(id);
      setEvent(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch event');
      showToast(err.response?.data?.message || 'Failed to fetch event', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id, fetchEvent]);

  return { event, loading, error, fetchEvent };
};