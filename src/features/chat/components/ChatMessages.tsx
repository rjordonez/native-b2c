import React, { useRef, useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import { useAppDispatch } from '../../../store/hooks';
import { Conversation } from '../types';
import { enhanceTranscript } from '../chatSlice';
import { openModalWithSentences } from '../../pronunciation/pronunciationSlice';
import VoiceMessage from './VoiceMessage';


interface ChatMessagesProps {
  activeConversation: Conversation;
  isTyping: boolean;
  formatTimestamp: (timestamp: string) => string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  activeConversation,
  isTyping,
  formatTimestamp,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleEnhanceTranscript = (transcript: string) => {
    dispatch(enhanceTranscript({
      conversationId: activeConversation.id,
      transcript
    }));
  };

  const handleShadowSentence = (enhancedText: string) => {
    console.log('Shadow sentence clicked with text:', enhancedText);
    
    // Parse enhanced text into sentences
    const sentences = enhancedText
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0)
      .map(sentence => sentence.replace(/^[^a-zA-Z0-9]*/, '').replace(/[^a-zA-Z0-9]*$/, ''));
    
    console.log('Parsed sentences:', sentences);
    
    dispatch(openModalWithSentences(sentences));
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation.messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
      {activeConversation.messages.map((msg) => {
        // Render voice message if audioUrl or audioData exists
        if (msg.audioUrl || msg.audioData) {
          return (
            <VoiceMessage
              key={msg.id}
              audioUrl={msg.audioUrl}
              audioData={msg.audioData}
              sender={msg.sender}
              timestamp={msg.timestamp}
              formatTimestamp={formatTimestamp}
              transcription={msg.transcription}
              pronunciation={msg.pronunciation}
              onEnhanceTranscript={handleEnhanceTranscript}
            />
          );
        }

        // Render text message
        return (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : msg.isEnhanced ? 'bg-gray-50 border border-gray-100 text-gray-900 rounded-bl-sm' : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <div className="text-sm leading-relaxed">
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                
                {/* Shadow sentence button for enhanced messages */}
                {msg.isEnhanced && msg.sender === 'assistant' && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleShadowSentence(msg.content)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Shadow sentence
                    </button>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 px-1">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
      
      {/* Typing Indicator */}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <CircleNotch size={16} className="animate-spin" />
              <span className="text-sm">AI is typing...</span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;