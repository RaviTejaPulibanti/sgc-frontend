import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '../api/users';
import { User } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { isSuperAdmin } = useAuth();

  const fetchSubscribers = useCallback(async () => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAllSubscribers();
      setSubscribers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch subscribers');
      showToast(err.response?.data?.message || 'Failed to fetch subscribers', 'error');
    } finally {
      setLoading(false);
    }
  }, [isSuperAdmin, showToast]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return { subscribers, loading, error, refetch: fetchSubscribers };
};