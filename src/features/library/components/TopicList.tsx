import React, { useEffect, useRef } from 'react';
import { CaretDown, BookOpen, CircleNotch, Warning } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  selectPaginatedTopics,
  selectLoading,
  selectError,
  selectFixedHeight,
  setFixedHeight,
  selectPaginationInfo,
  fetchTopicsFromDB,
  resetFilters
} from '../librarySlice';
import { Button } from '../../../shared/components/layout/ui/button';
import TopicRow from './TopicRow';
import TopicRowSkeleton from './TopicRowSkeleton';

const TopicList: React.FC = () => {
  const dispatch = useAppDispatch();
  const topics = useAppSelector(selectPaginatedTopics);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const fixedHeight = useAppSelector(selectFixedHeight);
  const paginationInfo = useAppSelector(selectPaginationInfo);
  const containerRef = useRef<HTMLDivElement>(null);

  // Capture first page height for fixed container size - only once when first page loads
  useEffect(() => {
    if (!loading && topics.length > 0 && paginationInfo.currentPage === 1 && containerRef.current && fixedHeight === null) {
      // Use requestAnimationFrame to ensure DOM is painted
      const rafId = requestAnimationFrame(() => {
        // Then use setTimeout for additional safety
        const timer = setTimeout(() => {
          if (containerRef.current && fixedHeight === null) {
            const measuredHeight = containerRef.current.scrollHeight;
            // Ensure minimum height of 480px
            const finalHeight = Math.max(measuredHeight, 480);
            dispatch(setFixedHeight(finalHeight));
          }
        }, 150);
        
        // Store timer for cleanup
        (window as any).__topicListTimer = timer;
      });
      
      return () => {
        cancelAnimationFrame(rafId);
        const timer = (window as any).__topicListTimer;
        if (timer) {
          clearTimeout(timer);
          delete (window as any).__topicListTimer;
        }
      };
    }
  }, [loading, topics.length, paginationInfo.currentPage, fixedHeight, dispatch]);

  if (error) {
    return (
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
    );
  }

  return (
    <>
      {/* Header Row - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-xl p-3 border border-gray-200 mb-2">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-6">
            <div className="flex items-center gap-2 pl-2">
              <span className="text-sm font-medium text-gray-600">Topic</span>
              <CaretDown size={12} className="text-gray-400" />
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-sm font-medium text-gray-600">Part</span>
          </div>
          <div className="col-span-2">
            <span className="text-sm font-medium text-gray-600"></span>
          </div>
          <div className="col-span-1 flex justify-end">
            <span className="text-sm font-medium text-gray-600">Practice</span>
          </div>
          <div className="col-span-1">
            <span className="text-sm font-medium text-gray-600"></span>
          </div>
        </div>
      </div>

      {/* Topic Rows - Fixed Height Container */}
      <div className="bg-white rounded-xl border border-gray-200 p-2 lg:p-4">
        <div 
          ref={containerRef}
          className="overflow-y-auto overflow-x-hidden"
          style={{
            height: fixedHeight !== null && fixedHeight > 0 ? `${fixedHeight}px` : '480px',
            minHeight: '480px',
            transition: fixedHeight !== null ? 'height 0.3s ease-out' : 'none'
          }}
        >
          {loading ? (
            // Skeleton loading - show 10 skeleton rows
            Array.from({ length: 10 }).map((_, index) => (
              <TopicRowSkeleton key={`skeleton-${index}`} />
            ))
          ) : topics.length > 0 ? (
            topics.map((topic) => (
              <TopicRow key={topic.id} topic={topic} />
            ))
          ) : (
            <div className="p-12 text-center">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No topics found matching your criteria</p>
              <Button variant="secondary" onClick={() => dispatch(resetFilters())} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopicList;