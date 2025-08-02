import React from 'react';

interface MessageContentProps {
  content: string;
}

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  // Simple markdown-like formatting
  const formatContent = (text: string) => {
    // Split by lines to handle line breaks
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Handle bold text (**text**)
      const formattedLine = line.split(/(\*\*[^*]+\*\*)/).map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Remove ** and make bold
          return (
            <strong key={partIndex}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
      
      // Handle bullet points
      if (line.trim().startsWith('•')) {
        return (
          <div key={index} className="ml-4">
            {formattedLine}
          </div>
        );
      }
      
      // Regular line
      return (
        <div key={index}>
          {formattedLine}
          {line === '' && <br />}
        </div>
      );
    });
  };
  
  return (
    <div className="text-sm leading-relaxed">
      {formatContent(content)}
    </div>
  );
};

export default MessageContent;