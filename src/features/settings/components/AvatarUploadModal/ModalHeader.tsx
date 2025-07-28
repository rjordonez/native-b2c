import React from 'react';
import { X } from 'phosphor-react';

interface ModalHeaderProps {
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Change Profile Picture</h2>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={24} />
      </button>
    </div>
  );
};