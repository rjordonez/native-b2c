import React, { useRef, useEffect } from 'react';
import { CircleNotch } from 'phosphor-react';
import { Conversation } from '../types';

interface ChatMessagesProps {
  activeConversation: Conversation;
  isTyping: boolean;
  formatTimestamp: (date: Date) => string;
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
      {activeConversation.messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            <p
              className={`text-xs mt-1 ${
                msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}
            >
              {formatTimestamp(msg.timestamp)}
            </p>
          </div>
        </div>
      ))}
      
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