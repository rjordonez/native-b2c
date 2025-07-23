import React from 'react';
import { PaperPlaneTilt } from 'phosphor-react';
import { Button } from '../../../shared/components/layout/ui/button';

interface MessageInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  isLoading,
  onMessageChange,
  onSendMessage,
  onKeyPress,
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
        </div>
        <Button
          onClick={onSendMessage}
          disabled={!message.trim() || isLoading}
          className="flex items-center gap-2 px-4 py-3"
        >
          <PaperPlaneTilt size={16} />
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;