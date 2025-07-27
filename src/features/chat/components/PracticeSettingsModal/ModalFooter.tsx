import React from 'react';

interface ModalFooterProps {
  onCancel: () => void;
  onApply: () => void;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({ onCancel, onApply }) => {
  return (
    <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onApply}
        className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Apply
      </button>
    </div>
  );
};