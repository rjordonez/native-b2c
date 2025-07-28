import React from 'react';
import { Card } from '../../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../../shared/components/layout/ui/skeleton';
import { Conversation } from '../../types';
import { MessageItem } from './MessageItem';
import { formatDate } from './utils';

interface MessagesListProps {
  conversation: Conversation;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const MessagesList: React.FC<MessagesListProps> = ({ 
  conversation, 
  loading, 
  error,
  onRetry 
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Messages</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry Loading Messages
        </button>
      </Card>
    );
  }

  if (!conversation.messages || conversation.messages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No messages found in this conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900">Conversation: {conversation.title}</h4>
        <p className="text-sm text-gray-600 mt-1">
          {conversation.messages.length} messages • Created {formatDate(conversation.created_at)}
        </p>
      </div>

      {conversation.messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};