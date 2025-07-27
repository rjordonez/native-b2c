import React from 'react';
import { UserDetail, Conversation } from '../../types';

interface ModalHeaderProps {
  view: 'conversations' | 'messages';
  selectedUser: UserDetail | null;
  selectedConversation: Conversation | null;
  onBack: () => void;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  view, 
  selectedUser, 
  selectedConversation,
  onBack, 
  onClose 
}) => {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {view === 'messages' && (
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Back to conversations"
          >
            ←
          </button>
        )}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {view === 'conversations' ? 'Student Detail' : 'Conversation Messages'}
          </h2>
          {selectedUser && (
            <p className="text-gray-600 mt-1">
              {view === 'conversations' 
                ? selectedUser.email 
                : `${selectedUser.email} - ${selectedConversation?.title}`
              }
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