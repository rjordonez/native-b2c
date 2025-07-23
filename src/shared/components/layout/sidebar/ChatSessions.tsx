import React from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectSidebarCollapsed } from '../../../../store/slices/navigationSlice';
import { 
  selectConversations, 
  selectActiveConversation, 
  setActiveConversation,
  createConversation 
} from '../../../../features/chat/chatSlice';

const ChatSessions: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const conversations = useAppSelector(selectConversations);
  const activeConversation = useAppSelector(selectActiveConversation);
  const isChatPage = location.pathname === '/chat';

  const handleCreateConversation = () => {
    dispatch(createConversation({ title: 'New Conversation' }));
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Don't render if sidebar is collapsed
  if (sidebarCollapsed) {
    return null;
  }

  return (
    <div className={`px-4 pb-4 transform transition-all duration-300 ease-out ${
      isChatPage 
        ? 'opacity-100 translate-y-0 max-h-96' 
        : 'opacity-0 -translate-y-4 max-h-0 overflow-hidden'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Sessions</h3>
        <button
          onClick={handleCreateConversation}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          title="New Session"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div 
        className="space-y-1 overflow-y-auto pr-2" 
        style={{
          maxHeight: 'calc(100vh - 5rem - 10rem - 4rem - 2rem)', // Account for logo(5rem) + nav(10rem) + user box(4rem) + sessions header(2rem)
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
      >
        {conversations.map((conversation, index) => (
          <div
            key={conversation.id}
            className={`transform transition-all duration-300 ease-out ${
              isChatPage 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
            style={{
              transitionDelay: isChatPage ? `${100 + index * 50}ms` : '0ms'
            }}
          >
            <button
              onClick={() => dispatch(setActiveConversation(conversation.id))}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out ${
                activeConversation?.id === conversation.id
                  ? 'bg-gray-100 text-black transform scale-[1.02] shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-black hover:transform hover:scale-[1.01]'
              }`}
            >
              <div className="truncate font-medium">
                {conversation.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTimestamp(conversation.updatedAt)} • {conversation.messages.length} messages
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSessions;