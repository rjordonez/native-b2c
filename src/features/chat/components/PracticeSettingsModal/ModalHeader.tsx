import React from 'react';
import { X, Gear } from 'phosphor-react';

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gear size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold">Practice Settings</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};