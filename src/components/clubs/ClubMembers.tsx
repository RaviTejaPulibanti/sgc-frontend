// src/components/clubs/ClubMembers.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Mail, 
  Linkedin, 
  Github,
  GraduationCap,
  Calendar,
  Users,
  Filter,
  X
} from 'lucide-react';
import { Member } from '@/lib/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/helpers';
import membersApi from '@/lib/api/members';

interface ClubMembersProps {
  clubId: string;
}

const ClubMembers: React.FC<ClubMembersProps> = ({ clubId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [clubId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await membersApi.getMembers({ club: clubId });
      if (response.success && response.data) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique years from members, filtering out undefined values
  const availableYears = useMemo(() => {
    // First, filter out undefined and null years
    const validYears = members
      .map(m => m.year)
      .filter((year): year is number => year !== undefined && year !== null);
    
    // Use Array.from instead of spread operator for better compatibility
    const uniqueYears = Array.from(new Set(validYears));
    
    // Sort numerically
    return uniqueYears.sort((a, b) => a - b);
  }, [members]);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                         member.email.toLowerCase().includes(search.toLowerCase()) ||
                         (member.position && member.position.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRole = roleFilter ? member.role === roleFilter : true;
    const matchesYear = yearFilter ? member.year?.toString() === yearFilter : true;
    
    return matchesSearch && matchesRole && matchesYear;
  });

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      GS: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      JS: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      Member: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    };
    return colors[role] || colors.Member;
  };

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setYearFilter('');
  };

  const activeFilterCount = (search ? 1 : 0) + (roleFilter ? 1 : 0) + (yearFilter ? 1 : 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-foreground">
          Members ({filteredMembers.length})
        </h2>
        
        {/* Mobile Filter Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden relative"
          leftIcon={<Filter className="w-4 h-4" />}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filters */}
      <div className={cn(
        'space-y-4',
        !showFilters && 'hidden sm:block'
      )}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
              rightIcon={search ? (
                <button 
                  onClick={() => setSearch('')} 
                  className="text-foreground-secondary hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : undefined}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
            aria-label="Filter by role"
          >
            <option value="">All Roles</option>
            <option value="GS">General Secretary</option>
            <option value="JS">Joint Secretary</option>
            <option value="Member">Member</option>
          </select>

          {/* Year Filter */}
          {availableYears.length > 0 && (
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[120px]"
              aria-label="Filter by year"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          )}
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-foreground-secondary">Active filters:</span>
            {search && (
              <Badge variant="primary" className="flex items-center gap-1">
                Search: {search}
                <button 
                  onClick={() => setSearch('')} 
                  className="ml-1 hover:text-white"
                  aria-label="Remove search filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {roleFilter && (
              <Badge variant="primary" className="flex items-center gap-1">
                Role: {roleFilter}
                <button 
                  onClick={() => setRoleFilter('')} 
                  className="ml-1 hover:text-white"
                  aria-label="Remove role filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {yearFilter && (
              <Badge variant="primary" className="flex items-center gap-1">
                Year: {yearFilter}
                <button 
                  onClick={() => setYearFilter('')} 
                  className="ml-1 hover:text-white"
                  aria-label="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
            <Users className="w-8 h-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
          <p className="text-foreground-secondary">
            {activeFilterCount > 0 
              ? 'Try adjusting your filters' 
              : 'No members have been added to this club yet'}
          </p>
          {activeFilterCount > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/members/${member._id}`}>
                <Card hover className="group cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {member.name}
                      </h3>
                      <p className="text-sm text-foreground-secondary truncate">
                        {member.position || member.role}
                      </p>
                      <div className="mt-2">
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {member.role}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 text-sm text-foreground-secondary">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {member.department} {member.year ? `- Year ${member.year}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.joiningDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          Joined {new Date(member.joiningDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      {member.socialLinks.linkedin && (
                        <a
                          href={member.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-accent-light hover:bg-accent-medium rounded-lg transition-colors"
                          aria-label="LinkedIn profile"
                        >
                          <Linkedin className="w-4 h-4 text-blue-600" />
                        </a>
                      )}
                      {member.socialLinks.github && (
                        <a
                          href={member.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-accent-light hover:bg-accent-medium rounded-lg transition-colors"
                          aria-label="GitHub profile"
                        >
                          <Github className="w-4 h-4 text-foreground" />
                        </a>
                      )}
                    </div>
                  )}
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubMembers;