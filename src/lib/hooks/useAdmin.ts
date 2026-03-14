import { useState, useEffect, useCallback } from 'react';
import { adminsApi } from '../api/admins';
import { Admin } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const useAdmins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { isSuperAdmin } = useAuth();

  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await adminsApi.getAll();
      setAdmins(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admins');
      showToast(err.response?.data?.message || 'Failed to fetch admins', 'error');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, showToast]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const updateAdmin = async (id: string, data: Partial<Admin>) => {
    try {
      const response = await adminsApi.update(id, data);
      showToast('Admin updated successfully', 'success');
      fetchAdmins();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update admin', 'error');
      throw err;
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
      await adminsApi.delete(id);
      showToast('Admin deleted successfully', 'success');
      fetchAdmins();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete admin', 'error');
      throw err;
    }
  };

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    updateAdmin,
    deleteAdmin,
  };
};