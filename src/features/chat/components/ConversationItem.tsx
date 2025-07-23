import React from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import { useAppDispatch } from '../../../store/hooks';
import { setActiveConversation, deleteConversation } from '../chatSlice';
import { Conversation } from '../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isEditing: boolean;
  newTitle: string;
  conversationsCount: number;
  onEditTitle: (id: string, title: string) => void;
  onSaveTitle: (id: string) => void;
  onNewTitleChange: (title: string) => void;
  formatTimestamp: (date: Date) => string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  isEditing,
  newTitle,
  conversationsCount,
  onEditTitle,
  onSaveTitle,
  onNewTitleChange,
  formatTimestamp,
}) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(setActiveConversation(conversation.id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTitle(conversation.id, conversation.title);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(deleteConversation(conversation.id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSaveTitle(conversation.id);
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => onNewTitleChange(e.target.value)}
              onBlur={() => onSaveTitle(conversation.id)}
              onKeyPress={handleKeyPress}
              className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded"
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {conversation.title}
            </h3>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formatTimestamp(conversation.updatedAt)}
          </p>
          <p className="text-xs text-gray-600 mt-1 truncate h-4">
            {conversation.messages.length > 0 
              ? conversation.messages[conversation.messages.length - 1].content 
              : ''
            }
          </p>
        </div>
        
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <PencilSimple size={14} />
          </button>
          {conversationsCount > 1 && (
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;