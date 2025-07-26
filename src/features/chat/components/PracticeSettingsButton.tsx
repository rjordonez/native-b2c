import React, { useState } from 'react';
import { Gear } from 'phosphor-react';
import PracticeSettingsModal from './PracticeSettingsModal';

const PracticeSettingsButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative group"
        title="Practice Settings"
      >
        <Gear size={20} />
        {/* Tooltip */}
        <span className="absolute right-0 top-full mt-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Practice Settings
        </span>
      </button>
      
      <PracticeSettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PracticeSettingsButton;