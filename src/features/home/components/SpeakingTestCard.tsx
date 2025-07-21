import React from 'react';
import { Play } from 'phosphor-react';

const SpeakingTestCard: React.FC = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-black">Speaking Test</h3>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">7.5</div>
          <div className="text-sm text-gray-500">Last Score</div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Play size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Next Practice</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            "Describe a time when you learned something new"
          </p>
          <button className="w-full bg-blue-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Start Speaking
          </button>
        </div>
        
        <div className="text-center">
          <div className="text-xs text-gray-400">
            Practice daily • Target: 8.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTestCard;