// src/components/clubs/ClubList.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  List, 
  SlidersHorizontal, 
  X,
  Users,
  Calendar,
  ArrowRight 
} from 'lucide-react';
import { Club } from '@/lib/types';
import ClubFilters from './ClubFilters';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/helpers';

interface ClubListProps {
  clubs: Club[];
  loading?: boolean;
  total?: number;
  onFilterChange?: (filters: any) => void;
}

const ClubList: React.FC<ClubListProps> = ({ 
  clubs, 
  loading = false, 
  total,
  onFilterChange 
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleFilterChange = (filters: any) => {
    const count = Object.values(filters).filter(v => v && v !== '').length;
    setActiveFilters(count);
    onFilterChange?.(filters);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technical: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      cultural: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      sports: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      academic: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
      other: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Filter Bar Skeleton */}
        <div className="h-12 bg-accent-light rounded-xl animate-pulse" />
        
        {/* Club Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card-bg rounded-xl border border-border p-6">
              <Skeleton className="h-40 -mx-6 -mt-6 mb-4 rounded-t-xl" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-4 mb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Filter Toggle (Mobile) */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden relative"
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          >
            Filters
            {activeFilters > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </Button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 bg-accent-light rounded-lg">
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

          {/* Results Count */}
          <p className="text-sm text-foreground-secondary">
            Showing <span className="font-medium text-foreground">{clubs.length}</span> of{' '}
            <span className="font-medium text-foreground">{total || clubs.length}</span> clubs
          </p>
        </div>

        {/* Active Filters (Desktop) */}
        {activeFilters > 0 && (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm text-foreground-secondary">Active filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange({})}
              rightIcon={<X className="w-3 h-3" />}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Filters Panel (Mobile) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <ClubFilters onFilterChange={handleFilterChange} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel (Desktop) */}
      <div className="hidden lg:block">
        <ClubFilters onFilterChange={handleFilterChange} />
      </div>

      {/* No Results */}
      {clubs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
            <SlidersHorizontal className="w-8 h-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No clubs found</h3>
          <p className="text-foreground-secondary mb-4">
            Try adjusting your filters or search criteria
          </p>
          <Button onClick={() => handleFilterChange({})}>
            Clear Filters
          </Button>
        </motion.div>
      )}

      {/* Club Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {clubs.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/clubs/${club._id}`} className="block h-full">
                  <Card hover className="h-full flex flex-col cursor-pointer group">
                    <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-2xl">
                      {club.coverImage ? (
                        <Image
                          src={club.coverImage}
                          alt={club.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
                      )}
                      
                      {club.logo && (
                        <div className="absolute -bottom-6 left-4 w-16 h-16 rounded-xl border-4 border-card-bg overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
                          <Image
                            src={club.logo}
                            alt={club.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 pt-4">
                      {/* Category Badge */}
                      <div className="mb-3">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          getCategoryColor(club.category)
                        )}>
                          {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {club.name}
                      </h3>
                      
                      <p className="text-foreground-secondary text-sm mb-4 line-clamp-2">
                        {club.description}
                      </p>

                      {club.stats && (
                        <div className="flex items-center gap-4 text-sm text-foreground-secondary mb-4">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {club.stats.members} members
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {club.stats.totalEvents} events
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                        <span className="text-xs text-foreground-tertiary">
                          Est. {club.establishedDate ? new Date(club.establishedDate).getFullYear() : 'N/A'}
                        </span>
                        
                        <span className="inline-flex items-center text-primary group-hover:translate-x-1 transition-transform text-sm font-medium">
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
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
            {clubs.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/clubs/${club._id}`}>
                  <Card hover className="flex flex-col sm:flex-row gap-6 transition-all group cursor-pointer">
                    {/* Logo */}
                    <div className="sm:w-24 sm:h-24 flex-shrink-0">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-accent-light">
                        {club.logo ? (
                          <Image
                            src={club.logo}
                            alt={club.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                            {club.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {club.name}
                        </h3>
                        <span className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          getCategoryColor(club.category)
                        )}>
                          {club.category.charAt(0).toUpperCase() + club.category.slice(1)}
                        </span>
                      </div>

                      <p className="text-foreground-secondary text-sm mb-3 line-clamp-2">
                        {club.description}
                      </p>

                      {club.stats && (
                        <div className="flex items-center gap-4 text-sm text-foreground-secondary">
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {club.stats.members} members
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {club.stats.totalEvents} events
                          </span>
                          {club.establishedDate && (
                            <span className="text-xs text-foreground-tertiary">
                              Est. {new Date(club.establishedDate).getFullYear()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center">
                      <ArrowRight className="w-5 h-5 text-foreground-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClubList;