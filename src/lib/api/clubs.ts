import axiosInstance from './client';
import { Club, ClubFilters, ApiResponse, PaginatedResponse } from '../types';

export const clubsApi = {
  // Get all clubs (public)
  getAll: async (filters?: ClubFilters): Promise<PaginatedResponse<Club>> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    
    const response = await axiosInstance.get<PaginatedResponse<Club>>('/clubs', { params });
    return response.data;
  },

  // Get club by ID (public)
  getById: async (id: string): Promise<ApiResponse<Club>> => {
    const response = await axiosInstance.get<ApiResponse<Club>>(`/clubs/${id}`);
    return response.data;
  },

  // Create club (super admin only)
  create: async (formData: FormData): Promise<ApiResponse<Club>> => {
    const response = await axiosInstance.post<ApiResponse<Club>>('/clubs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update club (super admin only)
  update: async (id: string, formData: FormData): Promise<ApiResponse<Club>> => {
    const response = await axiosInstance.put<ApiResponse<Club>>(`/clubs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete club (super admin only)
delete: async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(`/clubs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete API error:', error);
    throw error;
  }
},

  // Get club members (public)
  getMembers: async (id: string): Promise<PaginatedResponse<any>> => {
    const response = await axiosInstance.get<PaginatedResponse<any>>(`/clubs/${id}/members`);
    return response.data;
  },

  // Get club events (public)
  getEvents: async (id: string, isFinished?: boolean, limit?: number): Promise<PaginatedResponse<any>> => {
    const params = new URLSearchParams();
    if (isFinished !== undefined) params.append('isFinished', String(isFinished));
    if (limit) params.append('limit', String(limit));
    
    const response = await axiosInstance.get<PaginatedResponse<any>>(`/clubs/${id}/events`, { params });
    return response.data;
  },
};