'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import ClubForm from '@/components/clubs/ClubForm';
import { useToast } from '@/lib/context/ToastContext';
import { clubsApi } from '@/lib/api/clubs'; // Changed from 'import clubsApi' to 'import { clubsApi }'
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function CreateClubPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin } = useAuth();

  // Redirect if not super admin
  React.useEffect(() => {
    if (!isSuperAdmin) {
      showToast('You do not have permission to create clubs', 'error');
      router.push('/dashboard/clubs');
    }
  }, [isSuperAdmin, router, showToast]);

  const handleSubmit = async (data: FormData) => {
    try {
      const response = await clubsApi.create(data);
      showToast('Club created successfully!', 'success');
      router.push(`/dashboard/clubs/${response.data._id}`);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create club', 'error');
      throw error;
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/clubs" className="mr-4">
          <Button variant="outline" size="sm">
            ← Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Club</h1>
      </div>

      <Card>
        <ClubForm onSubmit={handleSubmit} />
      </Card>
    </div>
  );
}