import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { fetchCompleteUserData, fetchConversationMessages, closeUserDetailModal, selectConversation, backToConversations } from '../devDashSlice';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { Conversation, Message, Transcription, PronunciationScore, EnhancedTranscript } from '../types';

export const UserDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userDetailModal } = useAppSelector((state) => state.devDash);
  const { 
    selectedUser, 
    completeUserData, 
    selectedConversation,
    loading, 
    messagesLoading,
    error, 
    messagesError,
    isOpen,
    view 
  } = userDetailModal;

  useEffect(() => {
    if (isOpen && selectedUser && !completeUserData) {
      dispatch(fetchCompleteUserData(selectedUser.id));
    }
  }, [dispatch, isOpen, selectedUser, completeUserData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatScore = (score: number | null | undefined) => {
    if (score === null || score === undefined) return 'N/A';
    return `${Math.round(score * 100) / 100}%`;
  };

  const handleClose = () => {
    dispatch(closeUserDetailModal());
  };

  const handleConversationClick = (conversation: Conversation) => {
    const conversationWithMessages = { ...conversation, messages: [] };
    dispatch(selectConversation(conversationWithMessages));
    dispatch(fetchConversationMessages(conversation.id));
  };

  const handleBackToConversations = () => {
    dispatch(backToConversations());
  };

  const getMessageCount = (conversation: Conversation) => {
    return conversation.messageCount || 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {view === 'messages' && (
              <button
                onClick={handleBackToConversations}
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
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {view === 'conversations' && (
            <>
              {loading && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </Card>
                </div>
              )}

              {error && (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading User Data</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => selectedUser && dispatch(fetchCompleteUserData(selectedUser.id))}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Loading Data
                  </button>
                </Card>
              )}

              {completeUserData && (
                <div className="space-y-6">
                  {/* Profile Overview */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Overview</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Full Name</div>
                        <div className="font-semibold text-gray-900">
                          {completeUserData.profile?.full_name || 'Not provided'}
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Username</div>
                        <div className="font-semibold text-gray-900">
                          {completeUserData.profile?.username || 'Not provided'}
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Country</div>
                        <div className="font-semibold text-gray-900">
                          {completeUserData.profile?.country || 'Not provided'}
                        </div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Target Band Score</div>
                        <div className="font-semibold text-gray-900">
                          {completeUserData.profile?.target_band_score || 'Not set'}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Conversations List */}
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Conversations ({completeUserData.conversations.length})
                    </h3>
                    {completeUserData.conversations.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {completeUserData.conversations.map((conversation) => (
                          <div 
                            key={conversation.id} 
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleConversationClick(conversation)}
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
                </div>
              )}
            </>
          )}

          {view === 'messages' && selectedConversation && (
            <>
              {messagesLoading && (
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
              )}

              {messagesError && (
                <Card className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Messages</h3>
                  <p className="text-gray-600 mb-4">{messagesError}</p>
                  <button
                    onClick={() => dispatch(fetchConversationMessages(selectedConversation.id))}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Loading Messages
                  </button>
                </Card>
              )}

              {selectedConversation.messages && selectedConversation.messages.length > 0 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900">Conversation: {selectedConversation.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedConversation.messages.length} messages • Created {formatDate(selectedConversation.created_at)}
                    </p>
                  </div>

                  {selectedConversation.messages.map((message: Message) => (
                    <Card key={message.id} className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                          message.sender === 'user' ? 'bg-blue-500' : 'bg-green-500'
                        }`}>
                          {message.sender === 'user' ? 'U' : 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm font-medium ${
                              message.sender === 'user' ? 'text-blue-600' : 'text-green-600'
                            }`}>
                              {message.sender === 'user' ? 'User' : 'Assistant'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-gray-800">{message.content}</p>
                          </div>

                          {/* Audio Info */}
                          {(message.audio_url || message.audio_data || message.audio_storage_url) && (
                            <div className="bg-blue-50 rounded p-2 mb-2">
                              <span className="text-xs text-blue-700 font-medium">🎵 Audio Message</span>
                              {message.audio_duration && (
                                <span className="text-xs text-blue-600 ml-2">
                                  ({message.audio_duration}s)
                                </span>
                              )}
                            </div>
                          )}

                          {/* Transcription */}
                          {message.transcriptions && message.transcriptions.length > 0 && (
                            <div className="bg-yellow-50 rounded p-3 mb-2">
                              <div className="text-xs font-medium text-yellow-700 mb-1">Transcription</div>
                              <p className="text-sm text-gray-800">{message.transcriptions[0].text}</p>
                              {message.transcriptions[0].confidence && (
                                <div className="text-xs text-yellow-600 mt-1">
                                  Confidence: {Math.round(message.transcriptions[0].confidence * 100)}%
                                </div>
                              )}
                            </div>
                          )}

                          {/* Enhanced Transcript */}
                          {message.enhanced_transcripts && message.enhanced_transcripts.length > 0 && (
                            <div className="bg-green-50 rounded p-3 mb-2">
                              <div className="text-xs font-medium text-green-700 mb-1">Enhanced Transcript</div>
                              <p className="text-sm text-gray-800">{message.enhanced_transcripts[0].enhanced_text}</p>
                            </div>
                          )}

                          {/* Pronunciation Scores */}
                          {message.pronunciation_scores && message.pronunciation_scores.length > 0 && (
                            <div className="bg-purple-50 rounded p-3">
                              <div className="text-xs font-medium text-purple-700 mb-2">Pronunciation Analysis</div>
                              <div className="grid grid-cols-4 gap-2 text-center">
                                <div>
                                  <div className="text-xs text-gray-600">Overall</div>
                                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].overall_score)}%</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600">Accuracy</div>
                                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].accuracy_score)}%</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600">Fluency</div>
                                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].fluency_score)}%</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-600">Complete</div>
                                  <div className="font-medium">{Math.round(message.pronunciation_scores[0].completeness_score)}%</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {selectedConversation.messages && selectedConversation.messages.length === 0 && !messagesLoading && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No messages found in this conversation</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};