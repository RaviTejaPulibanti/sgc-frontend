'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/context/ToastContext';
import { useAuth } from '@/lib/context/AuthContext';
import { clubsApi } from '@/lib/api/clubs'; // Changed from 'import clubsApi' to 'import { clubsApi }'
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';

export default function ClubsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin } = useAuth();
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await clubsApi.getAll({ isActive: true });
      setClubs(response.data);
    } catch (error) {
      showToast('Failed to fetch clubs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this club?')) return;
    
    try {
      await clubsApi.delete(id);
      showToast('Club deleted successfully', 'success');
      fetchClubs();
    } catch (error) {
      showToast('Failed to delete club', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Clubs</h1>
        {isSuperAdmin && (
          <Link href="/dashboard/clubs/create">
            <Button variant="primary">Create New Club</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <Card key={club._id} className="overflow-hidden">
            <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
              {club.coverImage && (
                <Image
                  src={club.coverImage}
                  alt={club.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {club.name}
                </h3>
                <Badge variant={club.isActive ? 'success' : 'default'}>
                  {club.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {club.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>Category: {club.category}</span>
                <span>Members: {club.stats?.members || 0}</span>
              </div>
              
              <div className="flex space-x-2">
                <Link href={`/dashboard/clubs/${club._id}`} className="flex-1">
                  <Button variant="outline" size="sm" fullWidth>
                    View
                  </Button>
                </Link>
                <Link href={`/dashboard/clubs/${club._id}/edit`} className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>
                    Edit
                  </Button>
                </Link>
                {isSuperAdmin && (
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(club._id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {clubs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No clubs found</p>
          {isSuperAdmin && (
            <Link href="/dashboard/clubs/create">
              <Button variant="primary" className="mt-4">
                Create Your First Club
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}