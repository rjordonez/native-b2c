import React from 'react';
import { CaretLeft, CaretRight } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  selectPaginationInfo,
  selectLoading,
  nextPage,
  previousPage
} from '../librarySlice';

const Pagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const paginationInfo = useAppSelector(selectPaginationInfo);
  const loading = useAppSelector(selectLoading);

  if (loading || paginationInfo.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-sm text-gray-600">
        {paginationInfo.totalItems > 0 
          ? `Showing ${paginationInfo.startIndex}-${paginationInfo.endIndex} of ${paginationInfo.totalItems} topics`
          : 'No topics found'
        }
      </div>
      
      {/* Pagination Controls - Rounded Primary Cube with White Arrows */}
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
  );
};

export default Pagination;