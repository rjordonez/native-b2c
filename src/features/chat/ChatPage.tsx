import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectActiveConversation,
  selectIsLoading,
  selectIsTyping,
  selectError,
  addUserMessage,
  sendMessage,
  createConversation,
  clearError
} from './chatSlice';
import {
  ChatMessages,
  MessageInput,
  EmptyState
} from './components';

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeConversation = useAppSelector(selectActiveConversation);
  const isLoading = useAppSelector(selectIsLoading);
  const isTyping = useAppSelector(selectIsTyping);
  const error = useAppSelector(selectError);

  const [message, setMessage] = useState('');

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleSendMessage = async () => {
    if (!message.trim() || !activeConversation || isLoading) return;

    const content = message.trim();
    setMessage('');

    // Add user message immediately
    dispatch(addUserMessage({ 
      conversationId: activeConversation.id, 
      content 
    }));

    // Send to AI
    dispatch(sendMessage({ 
      conversationId: activeConversation.id, 
      content 
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateConversation = () => {
    dispatch(createConversation({ title: 'New Conversation' }));
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {activeConversation ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeConversation.title}
              </h1>
              <p className="text-sm text-gray-500">
                {activeConversation.messages.length} messages
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200 flex-shrink-0">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <ChatMessages
            activeConversation={activeConversation}
            isTyping={isTyping}
            formatTimestamp={formatTimestamp}
          />

          <MessageInput
            message={message}
            isLoading={isLoading}
            onMessageChange={setMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
          />
        </>
      ) : (
        <EmptyState
          onCreateConversation={handleCreateConversation}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default ChatPage;