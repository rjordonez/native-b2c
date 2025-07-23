import React, { useRef, useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import { Conversation } from '../types';
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
                className={`px-4 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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