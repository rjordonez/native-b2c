import React from 'react';
import { Plus } from 'phosphor-react';
import { useAppDispatch } from '../../../store/hooks';
import { createConversation } from '../chatSlice';
import { Button } from '../../../shared/components/layout/ui/button';
import { Conversation } from '../types';
import ConversationItem from './ConversationItem';

interface ConversationsSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  isLoading: boolean;
  editingTitle: string | null;
  newTitle: string;
  onEditTitle: (id: string, title: string) => void;
  onSaveTitle: (id: string) => void;
  onNewTitleChange: (title: string) => void;
  formatTimestamp: (date: Date) => string;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({
  conversations,
  activeConversation,
  isLoading,
  editingTitle,
  newTitle,
  onEditTitle,
  onSaveTitle,
  onNewTitleChange,
  formatTimestamp,
}) => {
  const dispatch = useAppDispatch();

  const handleCreateConversation = () => {
    dispatch(createConversation({ title: 'New Conversation' }));
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <Button
            size="sm"
            onClick={handleCreateConversation}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New
          </Button>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            isActive={activeConversation?.id === conversation.id}
            isEditing={editingTitle === conversation.id}
            newTitle={newTitle}
            conversationsCount={conversations.length}
            onEditTitle={onEditTitle}
            onSaveTitle={onSaveTitle}
            onNewTitleChange={onNewTitleChange}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default ConversationsSidebar;