import React from 'react';
import SaveStatusIndicator from './SaveStatusIndicator';

const TopNav: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <SaveStatusIndicator />
        <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          Help
        </button>
      </div>
    </div>
  );
};

export default TopNav;