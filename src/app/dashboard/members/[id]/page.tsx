'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { membersApi } from '@/lib/api/members';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface Member {
  _id: string;
  name: string;
  email: string;
  role: 'GS' | 'JS' | 'Member';
  position?: string;
  image?: string;
  club: {
    _id: string;
    name: string;
  } | string;
  department: string;
  year: number;
  contactNumber?: string;
  isActive: boolean;
}

interface Club {
  _id: string;
  name: string;
}

export default function MembersPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  
  const [members, setMembers] = useState<Member[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // Filters
  const [selectedClub, setSelectedClub] = useState<string>(userClubId || '');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [selectedClub, selectedRole, selectedYear]);

  const fetchClubs = async () => {
    try {
      const response = await clubsApi.getAll({ isActive: true });
      setClubs(response.data);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (selectedClub) filters.club = selectedClub;
      if (selectedRole) filters.role = selectedRole;
      if (selectedYear) filters.year = parseInt(selectedYear);
      
      const response = await membersApi.getAll(filters);
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch members:', error);
      showToast('Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${memberName}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(id);
    
    try {
      console.log('🗑️ Attempting to delete member:', id);
      console.log('🔑 Auth token present:', !!localStorage.getItem('token'));
      
      const response = await membersApi.delete(id);
      console.log('✅ Delete response:', response);
      
      showToast(`Member "${memberName}" deleted successfully`, 'success');
      
      // Remove member from state
      setMembers(prev => prev.filter(member => member._id !== id));
    } catch (error: any) {
      console.error('❌ Delete error - Full details:', error);
      
      // Detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('📋 Response status:', error.response.status);
        console.error('📋 Response data:', error.response.data);
        console.error('📋 Response headers:', error.response.headers);
        
        let errorMessage = 'Failed to delete member';
        
        // Try to extract message from response
        if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
        
        // Handle specific status codes
        if (error.response.status === 403) {
          errorMessage = 'You do not have permission to delete members';
        } else if (error.response.status === 404) {
          errorMessage = 'Member not found';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Cannot delete member';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        showToast(errorMessage, 'error');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('📡 No response received:', error.request);
        showToast('Cannot connect to server. Please check your connection.', 'error');
      } else {
        // Something happened in setting up the request
        console.error('⚙️ Error:', error.message);
        showToast(error.message || 'An unexpected error occurred', 'error');
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedClub(userClubId || '');
    setSelectedRole('');
    setSelectedYear('');
    setSearchQuery('');
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'GS', label: 'General Secretary' },
    { value: 'JS', label: 'Joint Secretary' },
    { value: 'Member', label: 'Member' },
  ];

  const yearOptions = [
    { value: '', label: 'All Years' },
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'GS': return 'success';
      case 'JS': return 'info';
      default: return 'default';
    }
  };

  const isValidUrl = (url: string) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Members</h1>
        <Link href="/dashboard/members/create">
          <Button variant="primary">Add New Member</Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, email, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {isSuperAdmin && (
            <Select
              options={[
                { value: '', label: 'All Clubs' },
                ...clubs.map(club => ({ value: club._id, label: club.name }))
              ]}
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
            />
          )}

          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          />

          <Select
            options={yearOptions}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />
        </div>

        {(selectedClub || selectedRole || selectedYear || searchQuery) && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </Card>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No members found</p>
          <Link href="/dashboard/members/create">
            <Button variant="primary">Add Your First Member</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const clubName = typeof member.club === 'object' ? member.club?.name : 'Unknown Club';
            
            return (
              <Card key={member._id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                    {member.image && isValidUrl(member.image) ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {member.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {member.email}
                    </p>

                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                        {member.role}
                      </Badge>
                      <Badge variant="info" size="sm">
                        Year {member.year}
                      </Badge>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {member.department} • {clubName}
                    </p>

                    {member.position && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {member.position}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex space-x-2">
                  <Link href={`/dashboard/members/${member._id}`} className="flex-1">
                    <Button variant="outline" size="sm" fullWidth>
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/members/${member._id}/edit`} className="flex-1">
                    <Button variant="primary" size="sm" fullWidth>
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(member._id, member.name)}
                    disabled={deleteLoading === member._id}
                    isLoading={deleteLoading === member._id}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filteredMembers.length} of {members.length} members
      </div>
    </div>
  );
}