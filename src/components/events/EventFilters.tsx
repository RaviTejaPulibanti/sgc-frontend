'use client';

import React, { useState, useEffect } from 'react';
import { EventFilters as EventFiltersType, EventType } from '@/lib/types';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface EventFiltersProps {
  filters: EventFiltersType;
  onFilterChange: (filters: EventFiltersType) => void;
  showSearch?: boolean;
  showDateFilters?: boolean;
}

const EventFilters: React.FC<EventFiltersProps> = ({ 
  filters, 
  onFilterChange,
  showSearch = true,
  showDateFilters = false 
}) => {
  // Local search state for debouncing
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({
          ...filters,
          search: searchInput || undefined,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters, onFilterChange]);

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
    { value: '', label: 'All Events' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    // Cast the value to EventType or undefined
    const eventType = value ? (value as EventType) : undefined;
    
    onFilterChange({
      ...filters,
      eventType: eventType,
      page: 1,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'upcoming') {
      onFilterChange({ 
        ...filters, 
        isFinished: false,
        page: 1,
      });
    } else if (value === 'completed') {
      onFilterChange({ 
        ...filters, 
        isFinished: true,
        page: 1,
      });
    } else {
      const { isFinished, ...rest } = filters;
      onFilterChange({ ...rest, page: 1 });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({ page: 1 });
  };

  const getCurrentStatus = () => {
    if (filters.isFinished === true) return 'completed';
    if (filters.isFinished === false) return 'upcoming';
    return '';
  };

  const hasFilters = filters.eventType || 
                     filters.isFinished !== undefined || 
                     filters.search;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        {/* Search Bar */}
        {showSearch && (
          <Input
            placeholder="Search events by name, description, or venue..."
            value={searchInput}
            onChange={handleSearchChange}
          />
        )}

        {/* Filter Row */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Event Type Filter */}
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Event Type"
              options={eventTypes}
              value={filters.eventType || ''}
              onChange={handleTypeChange}
            />
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[200px]">
            <Select
              label="Status"
              options={statusOptions}
              value={getCurrentStatus()}
              onChange={handleStatusChange}
            />
          </div>

          {/* Clear Filters Button */}
          {hasFilters && (
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Active filters:</span>
            {filters.eventType && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                Type: {filters.eventType}
              </span>
            )}
            {filters.isFinished === true && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                Completed
              </span>
            )}
            {filters.isFinished === false && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                Upcoming
              </span>
            )}
            {filters.search && (
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                Search: "{filters.search}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFilters;