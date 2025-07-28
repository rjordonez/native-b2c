import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  selectActiveConversation,
  selectIsLoading,
  selectIsTyping,
  selectError,
  createConversation,
  clearError,
  switchConversation
} from './store/conversationSlice';
import { startTopicPractice } from './store/topicPracticeThunks';
import {
  ChatMessages,
  VoiceRecorder,
  EmptyState,
  PracticeSettingsButton
} from './components';
import { ProgressDots } from './components/voice-recorder';
import { PronunciationModal } from '../pronunciation/components/PronunciationModal';

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeConversation = useAppSelector(selectActiveConversation);
  const isLoading = useAppSelector(selectIsLoading);
  const isTyping = useAppSelector(selectIsTyping);
  const error = useAppSelector(selectError);

  // Clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);
  



  const handleCreateConversation = () => {
    dispatch(createConversation({ title: 'New Conversation' }));
  };

  const handleTopicSelect = (topic: string) => {
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
      {isLoading ? (
        // Blank page while switching conversations (like ChatGPT)
        <div className="flex-1 bg-white"></div>
      ) : activeConversation ? (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {activeConversation.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeConversation.messages.length} messages
                </p>
              </div>
              <PracticeSettingsButton />
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

          {/* Progress indicators for topic practice */}
          <div className="px-4 pb-2 bg-white flex justify-center">
            <ProgressDots />
          </div>

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