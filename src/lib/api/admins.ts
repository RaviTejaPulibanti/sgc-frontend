import axiosInstance from './client';
import { Admin, ApiResponse, PaginatedResponse } from '../types';

export const adminsApi = {
  // Get all admins (super admin only)
  getAll: async (): Promise<PaginatedResponse<Admin>> => {
    const response = await axiosInstance.get<PaginatedResponse<Admin>>('/admins');
    return response.data;
  },

  // Get admin by ID (super admin only)
  getById: async (id: string): Promise<ApiResponse<Admin>> => {
    const response = await axiosInstance.get<ApiResponse<Admin>>(`/admins/${id}`);
    return response.data;
  },

  // Create admin (super admin only)
  create: async (data: any): Promise<ApiResponse<Admin>> => {
    try {
      console.log('📤 Creating admin with data:', data);
      const response = await axiosInstance.post<ApiResponse<Admin>>('/admins', data);
      console.log('📥 Create response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create admin error:', error);
      throw error;
    }
  },

  // Update admin (super admin only)
  update: async (id: string, data: Partial<Admin>): Promise<ApiResponse<Admin>> => {
    const response = await axiosInstance.put<ApiResponse<Admin>>(`/admins/${id}`, data);
    return response.data;
  },

  // Delete admin (super admin only)
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete<ApiResponse<null>>(`/admins/${id}`);
    return response.data;
  },
};