import React from 'react';
import { MagnifyingGlass } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  selectFilters,
  selectSearchQuery,
  updateFilters,
  setSearchQuery,
  resetFilters
} from '../librarySlice';
import { Button } from '../../../shared/components/layout/ui/button';
import { Card, CardContent } from '../../../shared/components/layout/ui/card';

const SearchFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const searchQuery = useAppSelector(selectSearchQuery);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              aria-label="Search IELTS topics"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filters.part}
              onChange={(e) => dispatch(updateFilters({ part: e.target.value }))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              aria-label="Filter by part"
            >
              <option value="all">Select Parts</option>
              <option value="part1">Part 1</option>
              <option value="part3">Part 3</option>
            </select>


            <Button variant="secondary" size="sm" onClick={() => dispatch(resetFilters())}>
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFilters;