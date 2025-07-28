import React from 'react';
import { Card } from '../../../../shared/components/layout/ui/card';
import { Conversation } from '../../types';
import { formatDate } from './utils';

interface ConversationsListProps {
  conversations: Conversation[];
  onConversationClick: (conversation: Conversation) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({ 
  conversations, 
  onConversationClick 
}) => {
  const getMessageCount = (conversation: Conversation) => {
    return conversation.messageCount || 0;
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Conversations ({conversations.length})
      </h3>
      {conversations.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onConversationClick(conversation)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{conversation.title}</h4>
                  <div className="text-sm text-gray-600 mb-2">
                    Type: {conversation.conversation_type || 'general'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(conversation.created_at)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-blue-600 mb-1">
                    {getMessageCount(conversation)} messages
                  </div>
                  <div className="text-xs text-gray-500">
                    Click to view →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No conversations found
        </div>
      )}
    </Card>
  );
};