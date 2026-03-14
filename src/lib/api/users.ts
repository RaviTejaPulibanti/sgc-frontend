import axiosInstance from './client';
import { User, SubscribeData, PreferencesData, ApiResponse, PaginatedResponse } from '../types';

export const usersApi = {
  // Subscribe to newsletter (public)
  subscribe: async (data: SubscribeData): Promise<ApiResponse<{ email: string; isSubscribed: boolean }>> => {
    const response = await axiosInstance.post('/users/subscribe', data);
    return response.data;
  },

  // Unsubscribe (public)
  unsubscribe: async (email: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.put('/users/unsubscribe', { email });
    return response.data;
  },

  // Update preferences (public)
  updatePreferences: async (data: PreferencesData): Promise<ApiResponse<{ email: string; preferences: string[] }>> => {
    const response = await axiosInstance.put('/users/preferences', data);
    return response.data;
  },

  // Get user by email (public)
  getByEmail: async (email: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${email}`);
    return response.data;
  },

  // Get all subscribers (super admin only)
  getAllSubscribers: async (): Promise<PaginatedResponse<User>> => {
    const response = await axiosInstance.get<PaginatedResponse<User>>('/users/subscribers/all');
    return response.data;
  },
};