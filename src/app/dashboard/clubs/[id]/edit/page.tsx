'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import ClubForm from '@/components/clubs/ClubForm';
import { useToast } from '@/lib/context/ToastContext';
import { clubsApi } from '@/lib/api/clubs'; // Fixed: using named import
import Link from 'next/link';
import { Club } from '@/lib/types';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function EditClubPage() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const { showToast } = useToast();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  const clubId = params.id as string;

  useEffect(() => {
    if (!isSuperAdmin) {
      showToast('You do not have permission to edit clubs', 'error');
      router.push('/dashboard/clubs');
      return;
    }

    if (clubId) {
      fetchClub();
    }
  }, [clubId, isSuperAdmin, router, showToast]);

  const fetchClub = async () => {
    try {
      const response = await clubsApi.getById(clubId);
      setClub(response.data);
    } catch (error) {
      console.error('Failed to fetch club:', error);
      showToast('Failed to load club details', 'error');
      router.push('/dashboard/clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      await clubsApi.update(clubId, data);
      showToast('Club updated successfully!', 'success');
      router.push(`/dashboard/clubs/${clubId}`);
    } catch (error: any) {
      console.error('Update error:', error);
      showToast(error.response?.data?.message || 'Failed to update club', 'error');
      throw error;
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Club Not Found</h2>
        <Link href="/dashboard/clubs">
          <Button variant="primary">Back to Clubs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/clubs/${clubId}`} className="mr-4">
          <Button variant="outline" size="sm">
            ← Back to Club
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Club: {club.name}</h1>
      </div>

      <Card>
        <ClubForm 
          initialData={club} 
          onSubmit={handleSubmit}
          isEdit={true}
        />
      </Card>
    </div>
  );
}