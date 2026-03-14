'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/lib/context/ToastContext';
import { eventsApi } from '@/lib/api/events';
import { clubsApi } from '@/lib/api/clubs';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface Event {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  club: {
    _id: string;
    name: string;
    logo?: string;
  } | string;
  eventDate: string;
  lastRegistrationDate: string;
  registrationLink: string;
  venue: string;
  isFinished: boolean;
  eventType: string;
  poster?: string;
  maxParticipants?: number;
  registeredParticipants?: number;
  // isFeatured is optional - remove if not in your API
}

interface Club {
  _id: string;
  name: string;
}

export default function AdminEventsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { isSuperAdmin, isClubAdmin, userClubId } = useAuth();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  
  // Filters
  const [selectedClub, setSelectedClub] = useState<string>(userClubId || '');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedClub, selectedType, selectedStatus, dateRange]);

  const fetchClubs = async () => {
    try {
      const response = await clubsApi.getAll({ isActive: true });
      setClubs(response.data);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page: 1,
        limit: 50,
      };
      
      if (selectedClub) filters.club = selectedClub;
      if (selectedType) filters.eventType = selectedType;
      
      if (selectedStatus === 'upcoming') filters.isFinished = false;
      else if (selectedStatus === 'completed') filters.isFinished = true;
      
      if (dateRange.start) filters.startDate = dateRange.start;
      if (dateRange.end) filters.endDate = dateRange.end;
      
      const response = await eventsApi.getAll(filters);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      showToast('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, eventName: string) => {
    if (!confirm(`Are you sure you want to delete "${eventName}"?`)) return;

    setDeleteLoading(id);
    
    try {
      await eventsApi.delete(id);
      showToast(`Event "${eventName}" deleted successfully`, 'success');
      setEvents(prev => prev.filter(event => event._id !== id));
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to delete event', 'error');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedClub(userClubId || '');
    setSelectedType('');
    setSelectedStatus('');
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
  };

  const filteredEvents = events.filter(event => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Competition' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
  ];

  const clubOptions = [
    { value: '', label: 'All Clubs' },
    ...clubs.map(club => ({ value: club._id, label: club.name })),
  ];

  const getClubName = (event: Event) => {
    return typeof event.club === 'object' ? event.club?.name : 'Unknown Club';
  };

  const getStatusBadge = (event: Event) => {
    if (event.isFinished) return { variant: 'default' as const, label: 'Completed' };
    if (new Date(event.eventDate) < new Date()) return { variant: 'warning' as const, label: 'Ongoing' };
    return { variant: 'success' as const, label: 'Upcoming' };
  };

  const hasActiveFilters = selectedClub || selectedType || selectedStatus || searchQuery || dateRange.start || dateRange.end;

  if (loading && events.length === 0) {
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
          Manage Events
        </h1>
        <Link href="/dashboard/events/create" className="w-full sm:w-auto">
          <Button variant="primary" fullWidth>
            Create New Event
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
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search events by name, description, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Club Filter - Show to super admin only */}
            {isSuperAdmin && (
              <Select
                options={clubOptions}
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
              />
            )}

            {/* Event Type Filter */}
            <Select
              options={eventTypes}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />

            {/* Status Filter */}
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            />

            {/* Date Range - Simplified for mobile */}
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="Start"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1"
              />
              <Input
                type="date"
                placeholder="End"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1"
              />
            </div>
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
      {filteredEvents.length > 0 && (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-1">
          Showing <span className="font-semibold">{filteredEvents.length}</span> of{' '}
          <span className="font-semibold">{events.length}</span> events
        </p>
      )}

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="text-center py-8 sm:py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No events found</p>
          <Link href="/dashboard/events/create">
            <Button variant="primary">Create Your First Event</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const status = getStatusBadge(event);
            const clubName = getClubName(event);
            const eventDate = new Date(event.eventDate);
            
            return (
              <Card key={event._id} className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  <div className="flex items-start space-x-3 mb-3">
                    {/* Poster Thumbnail */}
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {event.poster ? (
                        <Image
                          src={event.poster}
                          alt={event.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">📅</span>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                        {event.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {clubName}
                      </p>
                      <div className="flex items-center mt-1">
                        <Badge variant={status.variant} size="sm">
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-3">
                    <p>📅 {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}</p>
                    <p>📍 {event.venue}</p>
                    <p>🎯 {event.eventType}</p>
                    {event.maxParticipants && (
                      <p>👥 {event.registeredParticipants || 0}/{event.maxParticipants}</p>
                    )}
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <Link href={`/dashboard/events/${event._id}`}>
                      <Button variant="outline" size="sm" fullWidth>
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/events/${event._id}/edit`}>
                      <Button variant="primary" size="sm" fullWidth>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(event._id, event.name)}
                      disabled={deleteLoading === event._id}
                      isLoading={deleteLoading === event._id}
                      fullWidth
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {event.name}
                      </h3>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {event.shortDescription || event.description.substring(0, 150)}...
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Organized by</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{clubName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Date & Time</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Venue</p>
                        <p className="text-sm text-gray-900 dark:text-white">{event.venue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Event Type</p>
                        <p className="text-sm text-gray-900 dark:text-white capitalize">{event.eventType}</p>
                      </div>
                      {event.maxParticipants && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-500">Participants</p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {event.registeredParticipants || 0} / {event.maxParticipants}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 mt-4 text-xs text-gray-500 dark:text-gray-500">
                      <span>ID: {event._id.slice(-8)}</span>
                      <span>Registration: {new Date(event.lastRegistrationDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Desktop Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4 min-w-[100px]">
                    <Link href={`/dashboard/events/${event._id}`}>
                      <Button variant="outline" size="sm" fullWidth>
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/events/${event._id}/edit`}>
                      <Button variant="primary" size="sm" fullWidth>
                        Edit
                      </Button>
                    </Link>
                    {!event.isFinished && (
                      <Link href={`/dashboard/events/${event._id}/post-event`}>
                        <Button variant="secondary" size="sm" fullWidth>
                          Post-Event
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(event._id, event.name)}
                      disabled={deleteLoading === event._id}
                      isLoading={deleteLoading === event._id}
                      fullWidth
                    >
                      Delete
                    </Button>
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