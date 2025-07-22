import React from 'react';

const TopNav: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6">
      <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
        Help
      </button>
    </div>
  );
};

export default TopNav;