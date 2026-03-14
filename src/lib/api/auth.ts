import axiosInstance from './client';
import { LoginCredentials, AuthResponse, ApiResponse, Admin } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  getProfile: async (): Promise<ApiResponse<Admin>> => {
    try {
      const response = await axiosInstance.get<ApiResponse<Admin>>('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) return false;
      
      // Optional: Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        if (Date.now() >= exp) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return false;
        }
        return true;
      } catch {
        return !!token;
      }
    }
    return false;
  },

  getUser: (): Admin | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  setUser: (user: Admin, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  isSuperAdmin: (): boolean => {
    const user = authApi.getUser();
    return user?.role === 'super_admin';
  },

  isClubAdmin: (): boolean => {
    const user = authApi.getUser();
    return user?.role === 'club_admin';
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
};