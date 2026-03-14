import React from 'react';
import { ClubFilters as ClubFiltersType } from '@/lib/types';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

interface ClubFiltersProps {
  filters: ClubFiltersType;
  onFilterChange: (filters: ClubFiltersType) => void;
  categories: { value: string; label: string }[];
}

const ClubFilters: React.FC<ClubFiltersProps> = ({
  filters,
  onFilterChange,
  categories,
}) => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      category: value || undefined,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({ isActive: true });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            label="Category"
            options={[
              { value: '', label: 'All Categories' },
              ...categories,
            ]}
            value={filters.category || ''}
            onChange={handleCategoryChange}
          />
        </div>

        {(filters.category) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClubFilters;