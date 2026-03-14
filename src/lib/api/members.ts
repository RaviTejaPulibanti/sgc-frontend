import axiosInstance from './client';
import { Member, MemberFilters, ApiResponse, PaginatedResponse } from '../types';

export const membersApi = {
  // Get all members (public)
  getAll: async (filters?: MemberFilters): Promise<PaginatedResponse<Member>> => {
    const params = new URLSearchParams();
    if (filters?.club) params.append('club', filters.club);
    if (filters?.role) params.append('role', filters.role);
    if (filters?.year) params.append('year', String(filters.year));
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    
    const response = await axiosInstance.get<PaginatedResponse<Member>>('/members', { params });
    return response.data;
  },

  // Get member by ID (public)
  getById: async (id: string): Promise<ApiResponse<Member>> => {
    const response = await axiosInstance.get<ApiResponse<Member>>(`/members/${id}`);
    return response.data;
  },

  // Get members by role (public)
  getByRole: async (role: string): Promise<PaginatedResponse<Member>> => {
    const response = await axiosInstance.get<PaginatedResponse<Member>>(`/members/role/${role}`);
    return response.data;
  },

  // Create member (admin only)
  create: async (formData: FormData): Promise<ApiResponse<Member>> => {
    const response = await axiosInstance.post<ApiResponse<Member>>('/members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update member (admin only)
  update: async (id: string, formData: FormData): Promise<ApiResponse<Member>> => {
    const response = await axiosInstance.put<ApiResponse<Member>>(`/members/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete member (admin only)
delete: async (id: string): Promise<ApiResponse<null>> => {
  try {
    console.log('🔵 API: Deleting member with ID:', id);
    console.log('🔵 API: Auth token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    
    const response = await axiosInstance.delete<ApiResponse<null>>(`/members/${id}`);
    console.log('🔵 API: Delete response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🔴 API: Delete error - FULL DETAILS:');
    
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('🔴 Status:', error.response.status);
      console.error('🔴 Status Text:', error.response.statusText);
      console.error('🔴 Response data:', error.response.data);
      console.error('🔴 Response headers:', error.response.headers);
      
      // Log the complete error object
      console.error('🔴 Full error object:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('🔴 No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('🔴 Error message:', error.message);
    }
    
    throw error;
  }
},
};