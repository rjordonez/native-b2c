import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, CircleNotch } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectSidebarCollapsed } from '../../../../store/slices/navigationSlice';
import { 
  selectConversations, 
  selectActiveConversation, 
  switchConversation,
  createConversation 
} from '../../../../features/chat/store/conversationSlice';

const SESSIONS_PER_PAGE = 14;

const ChatSessions: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const conversations = useAppSelector(selectConversations);
  const activeConversation = useAppSelector(selectActiveConversation);
  const isChatPage = location.pathname === '/chat';
  
  const [displayedSessions, setDisplayedSessions] = useState(SESSIONS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleCreateConversation = () => {
    // Clear active conversation to show topic selection UI
    dispatch(switchConversation(null));
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  // Load more sessions handler
  const loadMoreSessions = useCallback(() => {
    if (isLoadingMore || displayedSessions >= conversations.length) return;
    
    setIsLoadingMore(true);
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      setDisplayedSessions(prev => Math.min(prev + SESSIONS_PER_PAGE, conversations.length));
      setIsLoadingMore(false);
    }, 300);
  }, [isLoadingMore, displayedSessions, conversations.length]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSessions();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [loadMoreSessions]);

  // Reset displayed sessions when conversations change
  useEffect(() => {
    setDisplayedSessions(SESSIONS_PER_PAGE);
  }, [conversations.length]);

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
        ref={scrollContainerRef}
        className="space-y-1 overflow-y-auto pr-2" 
        style={{
          maxHeight: 'calc(100vh - 5rem - 10rem - 4rem - 2rem)', // Account for logo(5rem) + nav(10rem) + user box(4rem) + sessions header(2rem)
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
      >
        {conversations.slice(0, displayedSessions).map((conversation, index) => (
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
              onClick={async () => {
                await dispatch(switchConversation(conversation.id));
              }}
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
        
        {/* Loading indicator */}
        {displayedSessions < conversations.length && (
          <div 
            ref={loadMoreRef}
            className="py-3 flex justify-center"
          >
            {isLoadingMore ? (
              <CircleNotch size={20} className="animate-spin text-gray-400" />
            ) : (
              <div className="text-xs text-gray-400">Scroll for more</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSessions;