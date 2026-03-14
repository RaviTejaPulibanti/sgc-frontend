'use client';

import React, { useState } from 'react';
import { useClubs } from '@/lib/hooks/useClubs';
import ClubCard from '@/components/clubs/ClubCard';
import ClubFilters from '@/components/clubs/ClubFilters';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import { ClubFilters as ClubFiltersType } from '@/lib/types';

export default function ClubsPage() {
  const [filters, setFilters] = useState<ClubFiltersType>({
    isActive: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const { clubs, loading, error } = useClubs(filters);

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { value: 'technical', label: 'Technical' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'sports', label: 'Sports' },
    { value: 'academic', label: 'Academic' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clubs</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore and join our diverse range of clubs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="max-w-md mx-auto mb-6">
            <Input
              type="search"
              placeholder="Search clubs by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ClubFilters
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No clubs found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing {filteredClubs.length} club{filteredClubs.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}