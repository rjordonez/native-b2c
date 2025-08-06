import React, { useEffect, useState } from 'react';
import { X } from 'phosphor-react';
import { supabase } from '../../../shared/services/supabase';
import ChatMessages from '../../chat/components/ChatMessages';
import { formatDistanceToNow } from '../../../utils/dateUtils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  audioUrl?: string;
  audioData?: string;
  transcription?: {
    text: string;
    confidence?: number;
  };
  isTopicQuestion?: boolean;
  questionIndex?: number;
}

interface ChatViewModalProps {
  conversationId: string;
  conversationTitle: string;
  onClose: () => void;
}

export const ChatViewModal: React.FC<ChatViewModalProps> = ({
  conversationId,
  conversationTitle,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // Get messages from database
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select(`
          *,
          transcriptions (
            text,
            confidence
          )
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Failed to load messages:', msgError);
        return;
      }

      // Transform messages to the format expected by chat components
      const transformedMessages = (messagesData || []).map(msg => ({
        id: msg.client_id || msg.id,
        content: msg.content,
        sender: msg.sender as 'user' | 'assistant',
        timestamp: msg.created_at,
        audioUrl: msg.audio_storage_url || msg.audio_url,
        audioData: msg.audio_data,
        transcription: msg.transcriptions?.[0] ? {
          text: msg.transcriptions[0].text,
          confidence: msg.transcriptions[0].confidence,
        } : undefined,
        isTopicQuestion: msg.is_topic_question,
        questionIndex: msg.question_index,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  // Create a conversation object that matches what ChatMessages expects
  const conversation = {
    id: conversationId,
    title: conversationTitle,
    messages,
    createdAt: '',
    updatedAt: ''
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{conversationTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {messages.length} messages
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading conversation...</p>
              </div>
            </div>
          ) : (
            <ChatMessages
              activeConversation={conversation}
              isTyping={false}
              formatTimestamp={formatTimestamp}
            />
          )}
        </div>
      </div>
    </div>
  );
};