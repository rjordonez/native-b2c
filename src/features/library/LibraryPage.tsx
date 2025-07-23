import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  BookOpen, 
  MagnifyingGlass, 
  CaretDown,
  CaretUp,
  Warning,
  CircleNotch,
  CaretLeft,
  CaretRight
} from 'phosphor-react';
import {
  selectPaginatedTopics,
  selectPaginationInfo,
  selectFilters,
  selectSearchQuery,
  selectLoading,
  selectError,
  updateFilters,
  setSearchQuery,
  resetFilters,
  toggleTopicExpansion,
  fetchTopicsFromDB,
  clearError,
  nextPage,
  previousPage
} from './librarySlice';
import {
  selectTestDate,
  selectPracticeActivityDates
} from '../../shared/store/dashboardSlice';
import { Button } from '../../shared/components/layout/ui/button';
import { Card, CardContent } from '../../shared/components/layout/ui/card';
import { GitHubCard, ChecklistCard } from '../../shared/components/dashboard';

const LibraryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const topics = useAppSelector(selectPaginatedTopics);
  const paginationInfo = useAppSelector(selectPaginationInfo);
  const filters = useAppSelector(selectFilters);
  const searchQuery = useAppSelector(selectSearchQuery);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  
  // Home data for sidebar components
  const testDate = useAppSelector(selectTestDate);
  const completedDays = useAppSelector(selectPracticeActivityDates);

  // Fetch topics on component mount
  useEffect(() => {
    dispatch(fetchTopicsFromDB());
  }, [dispatch]);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);


  const getPartColor = (part: string) => {
    switch (part) {
      case 'part1': return 'bg-blue-100 text-blue-700';
      case 'part3': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">Your IELTS preparation hub with practice topics and progress tracking</p>
      </div>
      
      {/* Desktop: Two-column layout */}
      <div className="hidden lg:flex gap-6 flex-1">
        {/* Left Column - Library Content (65%) */}
        <div className="flex-1 flex flex-col" style={{ flex: '0 0 65%' }}>
          {/* Search and Filters */}
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

                <select
                  value={filters.completed === null ? 'all' : filters.completed ? 'completed' : 'incomplete'}
                  onChange={(e) => {
                    const value = e.target.value === 'all' ? null : e.target.value === 'completed';
                    dispatch(updateFilters({ completed: value }));
                  }}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  aria-label="Filter by completion status"
                >
                  <option value="all">Status</option>
                  <option value="completed">Completed</option>
                  <option value="incomplete">Incomplete</option>
                </select>

                <Button variant="secondary" size="sm" onClick={() => dispatch(resetFilters())}>
                  Clear
                </Button>
              </div>
            </div>
            </CardContent>
          </Card>

          {/* Header Row */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-2">
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-7">
                <div className="flex items-center gap-2 pl-2">
                  <span className="text-sm font-medium text-gray-600">Topic</span>
                  <CaretDown size={12} className="text-gray-400" />
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-600">Part</span>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <CaretUp size={12} className="text-gray-400" />
                </div>
              </div>
              <div className="col-span-1">
                <span className="text-sm font-medium text-gray-600"></span>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
              <Warning size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Error loading topics</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
              <button
                onClick={() => dispatch(fetchTopicsFromDB())}
                className="ml-auto px-3 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <CircleNotch size={32} className="animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">Loading topics...</span>
            </div>
          )}

          {/* Topic Rows - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {!loading && topics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                <div 
                  className="grid grid-cols-12 items-center gap-4 p-6 cursor-pointer"
                  onClick={() => dispatch(toggleTopicExpansion(topic.id))}
                >
                  {/* Topic */}
                  <div className="col-span-7">
                    <div className="font-semibold text-gray-900 pl-2">{topic.title}</div>
                  </div>

                  {/* Part */}
                  <div className="col-span-2 flex justify-start">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartColor(topic.part)}`}>
                      {topic.part === 'part1' ? 'Part 1' : 'Part 3'}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${topic.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className={`text-sm font-medium ${topic.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {topic.completed ? 'Complete' : 'Available'}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Arrow */}
                  <div className="col-span-1 flex justify-center">
                    <CaretDown 
                      size={24} 
                      className={`text-gray-700 transition-transform duration-300 ease-in-out ${topic.expanded ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </div>

                {/* Expanded Questions */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${topic.expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="border-t border-gray-100 p-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Practice Questions</h4>
                    <div className="space-y-3">
                      {topic.questionsList.map((question, index) => (
                        <div key={question.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg transform transition-all duration-200 hover:bg-gray-100">
                          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-700">{question.text}</div>
                            <div className="text-xs text-gray-500 mt-1 capitalize">
                              {question.type === 'part1' ? 'Part 1' : question.type === 'part2' ? 'Part 2' : 'Part 3'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {!loading && topics.length === 0 && !error && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No topics found matching your criteria</p>
                <Button variant="secondary" onClick={() => dispatch(resetFilters())} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                {paginationInfo.totalItems > 0 
                  ? `Showing ${paginationInfo.startIndex}-${paginationInfo.endIndex} of ${paginationInfo.totalItems} topics`
                  : 'No topics found'
                }
              </div>
              
              {/* Pagination Controls - Rounded Primary Cube with White Arrows */}
              {paginationInfo.totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(previousPage())}
                    disabled={!paginationInfo.hasPreviousPage}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      paginationInfo.hasPreviousPage
                        ? 'bg-primary hover:bg-primary/90 cursor-pointer'
                        : 'bg-gray-200 cursor-not-allowed'
                    }`}
                    aria-label="Previous page"
                  >
                    <CaretLeft 
                      size={16} 
                      className={paginationInfo.hasPreviousPage ? 'text-white' : 'text-gray-400'} 
                    />
                  </button>
                  
                  <span className="text-sm text-gray-600 px-2">
                    {paginationInfo.currentPage} / {paginationInfo.totalPages}
                  </span>
                  
                  <button
                    onClick={() => dispatch(nextPage())}
                    disabled={!paginationInfo.hasNextPage}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      paginationInfo.hasNextPage
                        ? 'bg-primary hover:bg-primary/90 cursor-pointer'
                        : 'bg-gray-200 cursor-not-allowed'
                    }`}
                    aria-label="Next page"
                  >
                    <CaretRight 
                      size={16} 
                      className={paginationInfo.hasNextPage ? 'text-white' : 'text-gray-400'} 
                    />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right Column - Sidebar Components (35%) */}
        <div className="flex flex-col gap-4" style={{ flex: '0 0 35%' }}>
          <GitHubCard
            testDate={testDate}
            completedDays={completedDays}
          />
          <ChecklistCard />
        </div>
      </div>
      
      {/* Mobile: Stacked layout */}
      <div className="lg:hidden space-y-6">
        <GitHubCard
          testDate={testDate}
          completedDays={completedDays}
        />
        <ChecklistCard />
        
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
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
            <div className="flex flex-col gap-2">
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

              <select
                value={filters.completed === null ? 'all' : filters.completed ? 'completed' : 'incomplete'}
                onChange={(e) => {
                  const value = e.target.value === 'all' ? null : e.target.value === 'completed';
                  dispatch(updateFilters({ completed: value }));
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                aria-label="Filter by completion status"
              >
                <option value="all">Status</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>

              <Button variant="secondary" size="sm" onClick={() => dispatch(resetFilters())}>
                Clear
              </Button>
            </div>
          </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <CircleNotch size={24} className="animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-600">Loading topics...</span>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Warning size={16} className="text-red-500" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-800">Error loading topics</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchTopicsFromDB())}
              className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Topics */}
        <div className="space-y-2">
          {!loading && topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => dispatch(toggleTopicExpansion(topic.id))}
              >
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{topic.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPartColor(topic.part)}`}>
                      {topic.part === 'part1' ? 'Part 1' : 'Part 3'}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${topic.completed ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className={`text-xs font-medium ${topic.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {topic.completed ? 'Complete' : 'Available'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pr-2">
                  <CaretDown 
                    size={24} 
                    className={`text-gray-700 transition-transform duration-300 ease-in-out ${topic.expanded ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              {/* Expanded Questions */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${topic.expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-t border-gray-100 p-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-4">Practice Questions</h4>
                  <div className="space-y-3">
                    {topic.questionsList.map((question, index) => (
                      <div key={question.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-sm text-gray-700">{question.text}</div>
                          <div className="text-xs text-gray-500 mt-1 capitalize">
                            {question.type === 'part1' ? 'Part 1' : question.type === 'part2' ? 'Part 2' : 'Part 3'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {!loading && topics.length === 0 && !error && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <BookOpen size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600">No topics found matching your criteria</p>
              <Button variant="secondary" onClick={() => dispatch(resetFilters())} className="mt-3" size="sm">
                Clear Filters
              </Button>
            </div>
          )}
          
          {/* Mobile Pagination */}
          {!loading && paginationInfo.totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 px-2">
              <div className="text-sm text-gray-600">
                {paginationInfo.totalItems > 0 
                  ? `${paginationInfo.startIndex}-${paginationInfo.endIndex} of ${paginationInfo.totalItems}`
                  : 'No topics'
                }
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(previousPage())}
                  disabled={!paginationInfo.hasPreviousPage}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    paginationInfo.hasPreviousPage
                      ? 'bg-primary hover:bg-primary/90 cursor-pointer'
                      : 'bg-gray-200 cursor-not-allowed'
                  }`}
                  aria-label="Previous page"
                >
                  <CaretLeft 
                    size={16} 
                    className={paginationInfo.hasPreviousPage ? 'text-white' : 'text-gray-400'} 
                  />
                </button>
                
                <span className="text-sm text-gray-600 px-2">
                  {paginationInfo.currentPage} / {paginationInfo.totalPages}
                </span>
                
                <button
                  onClick={() => dispatch(nextPage())}
                  disabled={!paginationInfo.hasNextPage}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    paginationInfo.hasNextPage
                      ? 'bg-primary hover:bg-primary/90 cursor-pointer'
                      : 'bg-gray-200 cursor-not-allowed'
                  }`}
                  aria-label="Next page"
                >
                  <CaretRight 
                    size={16} 
                    className={paginationInfo.hasNextPage ? 'text-white' : 'text-gray-400'} 
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;