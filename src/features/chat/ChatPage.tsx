import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectActiveConversation,
  selectIsLoading,
  selectIsTyping,
  selectError,
  createConversation,
  clearError,
  startTopicPractice
} from './chatSlice';
import {
  ChatMessages,
  VoiceRecorder,
  EmptyState
} from './components';
import { PronunciationModal } from '../pronunciation/components/PronunciationModal';

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const activeConversation = useAppSelector(selectActiveConversation);
  const isLoading = useAppSelector(selectIsLoading);
  const isTyping = useAppSelector(selectIsTyping);
  const error = useAppSelector(selectError);
  
  console.log('ChatPage render - activeConversation:', activeConversation);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Handle navigation from library with topic practice
  useEffect(() => {
    const state = location.state as { startPractice?: string } | null;
    if (state?.startPractice) {
      console.log('Starting practice from navigation state:', state.startPractice);
      dispatch(startTopicPractice({ topicName: state.startPractice }));
      
      // Clear the navigation state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state, dispatch]);

  const handleCreateConversation = () => {
    dispatch(createConversation({ title: 'New Conversation' }));
  };

  const handleTopicSelect = (topic: string) => {
    console.log('Topic selected:', topic);
    // Start topic practice which creates conversation and sends first question
    dispatch(startTopicPractice({ topicName: topic }));
  };

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
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

          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 flex justify-center">
            <VoiceRecorder />
          </div>
        </>
      ) : (
        <EmptyState
          onCreateConversation={handleCreateConversation}
          onTopicSelect={handleTopicSelect}
          isLoading={isLoading}
        />
      )}
      
      {/* Pronunciation Modal */}
      <PronunciationModal />
    </div>
  );
};

export default ChatPage;