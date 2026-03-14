import axiosInstance from './client';
import { Event, EventFilters, ApiResponse } from '../types';

// Define PaginatedResponse locally if not exported from types
export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  data: T[];
  page?: number;
  pages?: number;
  total?: number;
}

export const eventsApi = {
  // Get all events (public)
  getAll: async (filters?: EventFilters): Promise<PaginatedResponse<Event>> => {
    const params = new URLSearchParams();
    if (filters?.club) params.append('club', filters.club);
    if (filters?.eventType) params.append('eventType', filters.eventType);
    if (filters?.isFinished !== undefined) params.append('isFinished', String(filters.isFinished));
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.search) params.append('search', filters.search);
    
    const response = await axiosInstance.get<PaginatedResponse<Event>>('/events', { params });
    return response.data;
  },

  // Get upcoming events (public)
  getUpcoming: async (): Promise<PaginatedResponse<Event>> => {
    const response = await axiosInstance.get<PaginatedResponse<Event>>('/events/upcoming');
    return response.data;
  },

  // Get event by ID (public)
  getById: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await axiosInstance.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data;
  },

  // Create event (admin only)
  create: async (formData: FormData): Promise<ApiResponse<Event>> => {
    try {
      const response = await axiosInstance.post<ApiResponse<Event>>('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event (admin only)
  update: async (id: string, formData: FormData): Promise<ApiResponse<Event>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Event>>(`/events/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Add post-event details (admin only)
  addPostEvent: async (id: string, formData: FormData): Promise<ApiResponse<Event>> => {
    try {
      const response = await axiosInstance.put<ApiResponse<Event>>(`/events/${id}/post-event`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding post-event details:', error);
      throw error;
    }
  },

  // Delete event (admin only)
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await axiosInstance.delete<ApiResponse<null>>(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
};