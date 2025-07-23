import React from 'react';

const TopicRowSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-12 items-center gap-4 px-3 py-2 rounded-lg">
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
    </div>
  );
};

export default TopicRowSkeleton;