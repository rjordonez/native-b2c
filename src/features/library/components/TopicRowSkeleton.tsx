import React from 'react';

const TopicRowSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Desktop skeleton */}
      <div className="hidden lg:grid grid-cols-12 items-center gap-4 px-3 py-2 rounded-lg">
        {/* Topic skeleton */}
        <div className="col-span-6">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Part skeleton */}
        <div className="col-span-2 flex justify-start">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>

        {/* Empty space */}
        <div className="col-span-2"></div>

        {/* Practice button skeleton */}
        <div className="col-span-1 flex justify-end">
          <div className="h-7 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Arrow skeleton */}
        <div className="col-span-1 flex justify-end">
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export default TopicRowSkeleton;