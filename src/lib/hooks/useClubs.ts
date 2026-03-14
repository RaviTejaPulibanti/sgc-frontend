import { useState, useEffect, useCallback } from 'react';
import { clubsApi } from '../api/clubs';
import { Club, ClubFilters } from '../types';
import { useToast } from '../context/ToastContext';

export const useClubs = (initialFilters?: ClubFilters) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ClubFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    count: 0,
    page: 1,
    pages: 1,
    total: 0,
  });

  const { showToast } = useToast();

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubsApi.getAll(filters);
      setClubs(response.data);
      setPagination({
        count: response.count,
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || response.count,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch clubs');
      showToast(err.response?.data?.message || 'Failed to fetch clubs', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const createClub = async (formData: FormData) => {
    try {
      const response = await clubsApi.create(formData);
      showToast('Club created successfully', 'success');
      fetchClubs();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create club', 'error');
      throw err;
    }
  };

  const updateClub = async (id: string, formData: FormData) => {
    try {
      const response = await clubsApi.update(id, formData);
      showToast('Club updated successfully', 'success');
      fetchClubs();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update club', 'error');
      throw err;
    }
  };

  const deleteClub = async (id: string) => {
    try {
      await clubsApi.delete(id);
      showToast('Club deleted successfully', 'success');
      fetchClubs();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete club', 'error');
      throw err;
    }
  };

  return {
    clubs,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    fetchClubs,
    createClub,
    updateClub,
    deleteClub,
  };
};

export const useClub = (id: string) => {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchClub = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clubsApi.getById(id);
      setClub(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch club');
      showToast(err.response?.data?.message || 'Failed to fetch club', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (id) {
      fetchClub();
    }
  }, [id, fetchClub]);

  return { club, loading, error, fetchClub };
};