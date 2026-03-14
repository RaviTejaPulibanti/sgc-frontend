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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
    if (!confirm(`Are you sure you want to delete "${memberName}"?`)) return;

    setDeleteLoading(id);
    
    try {
      await membersApi.delete(id);
      showToast(`Member "${memberName}" deleted successfully`, 'success');
      setMembers(prev => prev.filter(member => member._id !== id));
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete member', 'error');
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

  const clubOptions = [
    { value: '', label: 'All Clubs' },
    ...clubs.map(club => ({ value: club._id, label: club.name })),
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

  const getClubName = (member: Member) => {
    return typeof member.club === 'object' ? member.club?.name : 'Unknown Club';
  };

  const hasActiveFilters = selectedClub || selectedRole || selectedYear || searchQuery;

  if (loading && members.length === 0) {
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
          Manage Members
        </h1>
        <Link href="/dashboard/members/create" className="w-full sm:w-auto">
          <Button variant="primary" fullWidth>
            Add New Member
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
            {/* Search */}
            <Input
              placeholder="Search by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Club Filter - Only show to super admin */}
            {isSuperAdmin && (
              <Select
                options={clubOptions}
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
              />
            )}

            {/* Role Filter */}
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            />

            {/* Year Filter */}
            <Select
              options={yearOptions}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
          </div>

          {/* Desktop Clear Filters */}
          {hasActiveFilters && (
            <div className="hidden lg:flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}

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
      {filteredMembers.length > 0 && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-1">
          Showing <span className="font-semibold">{filteredMembers.length}</span> of{' '}
          <span className="font-semibold">{members.length}</span> members
        </p>
      )}

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <Card className="text-center py-8 sm:py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No members found</p>
          <Link href="/dashboard/members/create">
            <Button variant="primary">Add Your First Member</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMembers.map((member) => {
            const clubName = getClubName(member);
            
            return (
              <Card key={member._id} className="p-4 hover:shadow-lg transition-shadow">
                {/* Mobile Layout (stacked) */}
                <div className="block sm:hidden">
                  <div className="flex items-start space-x-3 mb-3">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {member.image && isValidUrl(member.image) ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                      <div className="flex items-center mt-1 space-x-1">
                        <Badge variant={getRoleBadgeVariant(member.role)} size="sm">
                          {member.role}
                        </Badge>
                        <Badge variant="info" size="sm">
                          Y{member.year}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                    <p className="truncate">{member.department} • {clubName}</p>
                    {member.position && (
                      <p className="text-gray-600 dark:text-gray-500">{member.position}</p>
                    )}
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <Link href={`/dashboard/members/${member._id}`}>
                      <Button variant="outline" size="sm" fullWidth>
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/members/${member._id}/edit`}>
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
                      fullWidth
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout (horizontal) */}
                <div className="hidden sm:block">
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
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {member.name}
                        </h3>
                        <div className="flex space-x-2">
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {member.role}
                          </Badge>
                          <Badge variant={member.isActive ? 'success' : 'default'}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {member.email}
                      </p>

                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant="info" size="sm">
                          Year {member.year}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {member.department}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {clubName} • ID: {member._id.slice(-8)}
                      </p>

                      {member.position && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {member.position}
                        </p>
                      )}

                      {/* Desktop Action Buttons */}
                      <div className="flex space-x-2 mt-4">
                        <Link href={`/dashboard/members/${member._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Link href={`/dashboard/members/${member._id}/edit`}>
                          <Button variant="primary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(member._id, member.name)}
                          disabled={deleteLoading === member._id}
                          isLoading={deleteLoading === member._id}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}