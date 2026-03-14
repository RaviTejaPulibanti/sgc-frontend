import { useState, useEffect, useCallback } from 'react';
import { membersApi } from '../api/members';
import { Member, MemberFilters } from '../types';
import { useToast } from '../context/ToastContext';

export const useMembers = (initialFilters?: MemberFilters) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MemberFilters>(initialFilters || {});
  const [pagination, setPagination] = useState({
    count: 0,
  });

  const { showToast } = useToast();

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await membersApi.getAll(filters);
      setMembers(response.data);
      setPagination({
        count: response.count,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch members');
      showToast(err.response?.data?.message || 'Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const createMember = async (formData: FormData) => {
    try {
      const response = await membersApi.create(formData);
      showToast('Member created successfully', 'success');
      fetchMembers();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to create member', 'error');
      throw err;
    }
  };

  const updateMember = async (id: string, formData: FormData) => {
    try {
      const response = await membersApi.update(id, formData);
      showToast('Member updated successfully', 'success');
      fetchMembers();
      return response.data;
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to update member', 'error');
      throw err;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await membersApi.delete(id);
      showToast('Member deleted successfully', 'success');
      fetchMembers();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete member', 'error');
      throw err;
    }
  };

  return {
    members,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
  };
};

export const useMember = (id: string) => {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchMember = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await membersApi.getById(id);
      setMember(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch member');
      showToast(err.response?.data?.message || 'Failed to fetch member', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    if (id) {
      fetchMember();
    }
  }, [id, fetchMember]);

  return { member, loading, error, fetchMember };
};