import React from 'react';
import { Upload, Sparkle } from 'phosphor-react';

interface TabSelectorProps {
  activeTab: 'upload' | 'gradient';
  onTabChange: (tab: 'upload' | 'gradient') => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={() => onTabChange('upload')}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          activeTab === 'upload'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Upload size={20} className="inline mr-2" />
        Upload Image
      </button>
      <button
        onClick={() => onTabChange('gradient')}
        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
          activeTab === 'gradient'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        <Sparkle size={20} className="inline mr-2" />
        Use Gradient
      </button>
    </div>
  );
};