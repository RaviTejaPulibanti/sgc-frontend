// src/components/events/EventList.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  List, 
  SlidersHorizontal, 
  X,
  Calendar,
  MapPin,
  Users,
  ArrowRight 
} from 'lucide-react';
import { Event } from '@/lib/types';
import EventCard from './EventCard';
import EventFilters from './EventFilters';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import Badge from '@/components/ui/Badge';
import { cn, formatDate } from '@/lib/utils/helpers';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  total?: number;
  onFilterChange?: (filters: any) => void;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
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

  const getStatusBadge = (event: Event) => {
    const now = new Date();
    const eventDate = new Date(event.eventDate);
    const lastRegDate = new Date(event.lastRegistrationDate);

    if (event.isFinished || eventDate < now) {
      return <Badge variant="default">Past Event</Badge>;
    }
    if (lastRegDate > now) {
      return <Badge variant="success">Registration Open</Badge>;
    }
    return <Badge variant="warning">Registration Closed</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
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
            Showing <span className="font-medium text-foreground">{events.length}</span> of{' '}
            <span className="font-medium text-foreground">{total || events.length}</span> events
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
            <EventFilters onFilterChange={handleFilterChange} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Panel (Desktop) */}
      <div className="hidden lg:block">
        <EventFilters onFilterChange={handleFilterChange} />
      </div>

      {/* No Results */}
      {events.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-accent-light flex items-center justify-center">
            <Calendar className="w-8 h-8 text-foreground-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
          <p className="text-foreground-secondary mb-4">
            {activeFilters > 0 
              ? 'Try adjusting your filters' 
              : 'No events have been created yet'}
          </p>
          {activeFilters > 0 && (
            <Button onClick={() => handleFilterChange({})}>
              Clear Filters
            </Button>
          )}
        </motion.div>
      )}

      {/* Events Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <EventCard event={event} />
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
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/events/${event._id}`}>
                  <Card hover className="flex flex-col sm:flex-row gap-6 transition-all group cursor-pointer">
                    {/* Poster/Image */}
                    <div className="sm:w-48 sm:h-32 flex-shrink-0">
                      <div className="relative w-full h-32 sm:h-32 rounded-lg overflow-hidden bg-accent-light">
                        {event.poster ? (
                          <img
                            src={event.poster}
                            alt={event.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {event.name}
                          </h3>
                          <p className="text-sm text-foreground-secondary mt-1">
                            {typeof event.club === 'object' ? event.club.name : 'Club Event'}
                          </p>
                        </div>
                        {getStatusBadge(event)}
                      </div>

                      <p className="text-foreground-secondary text-sm mb-3 line-clamp-2">
                        {event.shortDescription || event.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-foreground-secondary">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(event.eventDate)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {event.venue}
                        </span>
                        {event.maxParticipants && (
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.registeredParticipants || 0}/{event.maxParticipants}
                          </span>
                        )}
                      </div>
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

export default EventList;