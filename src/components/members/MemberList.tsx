// src/components/members/MemberList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  List, 
  SlidersHorizontal, 
  X,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { Member } from '@/lib/types';
import MemberCard from './MemberCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils/helpers';

interface MemberListProps {
  members: Member[];
  loading?: boolean;
  total?: number;
  onFilterChange?: (filters: any) => void;
}

const MemberList: React.FC<MemberListProps> = ({ 
  members, 
  loading = false, 
  total,
  onFilterChange 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');

  // Get unique years from members using Array.from instead of spread
  const availableYears = useMemo(() => {
    // First, collect all valid years
    const yearsArray: number[] = [];
    
    members.forEach(member => {
      if (member.year !== undefined && member.year !== null) {
        yearsArray.push(member.year);
      }
    });
    
    // Create a Set and convert back to array using Array.from
    const uniqueYearsSet = new Set(yearsArray);
    return Array.from(uniqueYearsSet).sort((a, b) => a - b);
  }, [members]);

  // Get unique roles from members using Array.from instead of spread
  const availableRoles = useMemo(() => {
    // Collect all roles
    const rolesArray: string[] = members.map(m => m.role);
    
    // Create a Set and convert back to array using Array.from
    const uniqueRolesSet = new Set(rolesArray);
    return Array.from(uniqueRolesSet);
  }, [members]);

  // Apply filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                         member.email.toLowerCase().includes(search.toLowerCase()) ||
                         (member.position && member.position.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRole = roleFilter ? member.role === roleFilter : true;
    const matchesYear = yearFilter ? member.year?.toString() === yearFilter : true;
    
    return matchesSearch && matchesRole && matchesYear;
  });

  const activeFilterCount = (search ? 1 : 0) + (roleFilter ? 1 : 0) + (yearFilter ? 1 : 0);

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setYearFilter('');
    onFilterChange?.({});
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      GS: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      JS: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      Member: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    };
    return colors[role] || colors.Member;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Members</h2>
          <Badge variant="primary">{filteredMembers.length}</Badge>
        </div>

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

        {/* View Toggle (Desktop) */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-accent-light rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="!px-2"
            aria-label="Grid view"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="!px-2"
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn('space-y-4', !showFilters && 'hidden sm:block')}>
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
          {availableRoles.length > 0 && (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
              aria-label="Filter by role"
            >
              <option value="">All Roles</option>
              {availableRoles.map(role => (
                <option key={role} value={role}>
                  {role === 'GS' ? 'General Secretary' : role === 'JS' ? 'Joint Secretary' : role}
                </option>
              ))}
            </select>
          )}

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

      {/* Results Count (Mobile) */}
      <div className="sm:hidden text-sm text-foreground-secondary">
        Showing {filteredMembers.length} of {total || members.length} members
      </div>

      {/* Members Grid/List */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
            <Users className="w-8 h-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No members found</h3>
          <p className="text-foreground-secondary">
            {activeFilterCount > 0 
              ? 'Try adjusting your filters' 
              : 'No members have been added yet'}
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
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <MemberCard member={member} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/members/${member._id}`}>
                    <Card hover className="flex items-center gap-4 p-4 cursor-pointer group">
                      {/* Avatar */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {member.name}
                          </h3>
                          <Badge className={getRoleBadgeColor(member.role)}>
                            {member.role}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-foreground-secondary">
                          {member.department} {member.year ? `• Year ${member.year}` : ''}
                        </p>
                        
                        {member.position && (
                          <p className="text-xs text-foreground-tertiary mt-1">
                            {member.position}
                          </p>
                        )}
                      </div>

                      {/* View Details Arrow */}
                      <div className="text-foreground-secondary group-hover:text-primary group-hover:translate-x-1 transition-all">
                        →
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MemberList;