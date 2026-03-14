'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { adminsApi } from '@/lib/api/admins';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'club_admin';
  club?: {
    _id: string;
    name: string;
  } | string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface Club {
  _id: string;
  name: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin } = useAuth();
  
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // Filters
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedClub, setSelectedClub] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // Redirect if not super admin
    if (!isSuperAdmin) {
      showToast('Access denied. Super admin only.', 'error');
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [isSuperAdmin, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch admins
      const adminsResponse = await adminsApi.getAll();
      setAdmins(adminsResponse.data);
      
      // Fetch clubs for filter
      const clubsResponse = await clubsApi.getAll({ isActive: true });
      setClubs(clubsResponse.data);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      showToast('Failed to load admins', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    try {
      await adminsApi.update(id, { isActive: !currentStatus });
      showToast(`Admin ${name} ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
      fetchData();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update admin status', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete admin "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(id);
    
    try {
      await adminsApi.delete(id);
      showToast(`Admin "${name}" deleted successfully`, 'success');
      setAdmins(prev => prev.filter(admin => admin._id !== id));
    } catch (error: any) {
      console.error('Delete error:', error);
      showToast(error.response?.data?.message || 'Failed to delete admin', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getClubName = (admin: Admin) => {
    if (!admin.club) return 'N/A';
    return typeof admin.club === 'object' ? admin.club.name : 'Unknown Club';
  };

  const filteredAdmins = admins.filter(admin => {
    if (selectedRole && admin.role !== selectedRole) return false;
    
    if (selectedClub) {
      const adminClubId = typeof admin.club === 'object' ? admin.club?._id : admin.club;
      if (adminClubId !== selectedClub) return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'club_admin', label: 'Club Admin' },
  ];

  const clubOptions = [
    { value: '', label: 'All Clubs' },
    ...clubs.map(club => ({ value: club._id, label: club.name })),
  ];

  const hasActiveFilters = selectedRole || selectedClub || searchQuery;

  const handleClearFilters = () => {
    setSelectedRole('');
    setSelectedClub('');
    setSearchQuery('');
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Manage Admins
        </h1>
        <Link href="/dashboard/admins/create" className="w-full sm:w-auto">
          <Button variant="primary" fullWidth>
            Add New Admin
          </Button>
        </Link>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </Button>
        
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            Clear
          </Button>
        )}
      </div>

      {/* Filters - Desktop & Mobile */}
      <div className={`
        ${showMobileFilters ? 'block' : 'hidden'} 
        lg:block transition-all duration-300
      `}>
        <Card className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />

            <Select
              options={clubOptions}
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            />

            {/* Desktop Clear Filters */}
            {hasActiveFilters && (
              <div className="hidden lg:flex items-end">
                <Button variant="outline" onClick={handleClearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Clear Filters (inside filter panel) */}
          {showMobileFilters && hasActiveFilters && (
            <div className="mt-3 lg:hidden">
              <Button variant="outline" onClick={handleClearFilters} fullWidth>
                Clear All Filters
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Results Count */}
      {filteredAdmins.length > 0 && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-1">
          Showing <span className="font-semibold">{filteredAdmins.length}</span> of{' '}
          <span className="font-semibold">{admins.length}</span> admins
        </p>
      )}

      {/* Admins List */}
      {filteredAdmins.length === 0 ? (
        <Card className="text-center py-8 sm:py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No admins found</p>
          <Link href="/dashboard/admins/create">
            <Button variant="primary">Add Your First Admin</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredAdmins.map((admin) => (
            <Card key={admin._id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
              {/* Mobile Layout (stacked) */}
              <div className="block sm:hidden">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {admin.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {admin.email}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Badge variant={admin.role === 'super_admin' ? 'success' : 'info'} size="sm">
                      {admin.role === 'super_admin' ? 'Super' : 'Club'}
                    </Badge>
                    <Badge variant={admin.isActive ? 'success' : 'default'} size="sm">
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                {admin.role === 'club_admin' && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                    Club: {getClubName(admin)}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 text-xs text-gray-500 dark:text-gray-500 mb-3">
                  <span className="truncate max-w-[150px]">ID: {admin._id.slice(-8)}</span>
                  {admin.lastLogin && (
                    <span>• Last: {new Date(admin.lastLogin).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Mobile Action Buttons - Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Link href={`/dashboard/admins/${admin._id}`}>
                    <Button variant="outline" size="sm" fullWidth>
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admins/${admin._id}/edit`}>
                    <Button variant="primary" size="sm" fullWidth>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant={admin.isActive ? 'warning' : 'success'}
                    size="sm"
                    onClick={() => handleToggleStatus(admin._id, admin.isActive, admin.name)}
                    fullWidth
                  >
                    {admin.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(admin._id, admin.name)}
                    disabled={deleteLoading === admin._id}
                    isLoading={deleteLoading === admin._id}
                    fullWidth
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {/* Desktop Layout (horizontal) */}
              <div className="hidden sm:flex sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {admin.name}
                    </h3>
                    <Badge variant={admin.role === 'super_admin' ? 'success' : 'info'}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Club Admin'}
                    </Badge>
                    <Badge variant={admin.isActive ? 'success' : 'default'}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {admin.email}
                  </p>
                  
                  {admin.role === 'club_admin' && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      Club: {getClubName(admin)}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <span className="hidden lg:inline">ID: {admin._id}</span>
                    <span className="lg:hidden">ID: {admin._id.slice(-8)}</span>
                    {admin.lastLogin && (
                      <span>Last: {new Date(admin.lastLogin).toLocaleDateString()}</span>
                    )}
                    <span>Created: {new Date(admin.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Desktop Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <Link href={`/dashboard/admins/${admin._id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/admins/${admin._id}/edit`}>
                    <Button variant="primary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant={admin.isActive ? 'warning' : 'success'}
                    size="sm"
                    onClick={() => handleToggleStatus(admin._id, admin.isActive, admin.name)}
                  >
                    {admin.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(admin._id, admin.name)}
                    disabled={deleteLoading === admin._id}
                    isLoading={deleteLoading === admin._id}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}