import React from 'react';
import { UserDetail } from '../../types';

interface ModalHeaderProps {
  selectedUser: UserDetail | null;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  selectedUser, 
  onClose
}) => {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            Student Detail
          </h2>
          {selectedUser && (
            <p className="text-gray-600 mt-1">
              {selectedUser.email}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        aria-label="Close modal"
      >
        ×
      </button>
    </div>
  );
};