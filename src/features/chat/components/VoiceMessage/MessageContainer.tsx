import React from 'react';

interface MessageContainerProps {
  sender: 'user' | 'assistant';
  children: React.ReactNode;
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ sender, children }) => {
  return (
    <div className={`flex items-start gap-3 ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex flex-col max-w-xs lg:max-w-md ${sender === 'user' ? 'items-end' : 'items-start'}`}>
        {children}
      </div>
    </div>
  );
};