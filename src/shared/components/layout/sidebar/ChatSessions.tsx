import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Plus, CircleNotch, DotsThreeVertical, Pencil, Trash } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectSidebarCollapsed } from '../../../../store/slices/navigationSlice';
import { 
  selectConversations, 
  selectActiveConversation, 
  switchConversation,
  createConversation,
  updateConversationTitle,
  deleteConversation
} from '../../../../features/chat/store/conversationSlice';
import {
  selectDisplayedSessions,
  selectIsLoadingMore,
  selectMenuOpenId,
  selectMenuPosition,
  selectHoveredId,
  selectEditingId,
  selectEditValue,
  setDisplayedSessions,
  setIsLoadingMore,
  setMenuOpenId,
  setMenuPosition,
  setHoveredId,
  setEditingId,
  setEditValue,
  incrementDisplayedSessions
} from '../../../../store/slices/sidebarUISlice';

const SESSIONS_PER_PAGE = 14;

const ChatSessions: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const conversations = useAppSelector(selectConversations);
  const activeConversation = useAppSelector(selectActiveConversation);
  const isChatPage = location.pathname === '/chat';
  
  // Get UI state from Redux
  const displayedSessions = useAppSelector(selectDisplayedSessions);
  const isLoadingMore = useAppSelector(selectIsLoadingMore);
  const menuOpenId = useAppSelector(selectMenuOpenId);
  const menuPosition = useAppSelector(selectMenuPosition);
  const hoveredId = useAppSelector(selectHoveredId);
  const editingId = useAppSelector(selectEditingId);
  const editValue = useAppSelector(selectEditValue);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const menuButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Memoize displayed conversations for performance
  const displayedConversations = useMemo(() => 
    conversations.slice(0, displayedSessions),
    [conversations, displayedSessions]
  );

  const handleCreateConversation = () => {
    // Clear active conversation to show topic selection UI
    dispatch(switchConversation(null));
  };

  const formatTimestamp = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }, []);

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
    dispatch(setDisplayedSessions(SESSIONS_PER_PAGE));
  }, [conversations.length, dispatch]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      dispatch(setMenuOpenId(null));
      dispatch(setMenuPosition(null));
    };

    if (menuOpenId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpenId, dispatch]);

  const handleMenuClick = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    
    if (menuOpenId === conversationId) {
      dispatch(setMenuOpenId(null));
      dispatch(setMenuPosition(null));
    } else {
      const button = menuButtonRefs.current[conversationId];
      if (button) {
        const rect = button.getBoundingClientRect();
        dispatch(setMenuPosition({
          top: rect.top,
          left: rect.right + 8 // 8px gap from the button
        }));
        dispatch(setMenuOpenId(conversationId));
      }
    }
  };

  const handleStartEdit = (conversationId: string, currentTitle: string) => {
    dispatch(setEditingId(conversationId));
    dispatch(setEditValue(currentTitle));
    dispatch(setMenuOpenId(null));
    dispatch(setMenuPosition(null));
  };

  const handleSaveEdit = (conversationId: string) => {
    if (editValue.trim()) {
      dispatch(updateConversationTitle({ 
        conversationId, 
        title: editValue.trim() 
      }));
    }
    dispatch(setEditingId(null));
    dispatch(setEditValue(''));
  };

  const handleCancelEdit = () => {
    dispatch(setEditingId(null));
    dispatch(setEditValue(''));
  };

  const handleDelete = (conversationId: string) => {
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      dispatch(deleteConversation(conversationId));
    }
    dispatch(setMenuOpenId(null));
    dispatch(setMenuPosition(null));
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
        ref={scrollContainerRef}
        className="space-y-1 overflow-y-auto pr-2" 
        style={{
          maxHeight: 'calc(100vh - 5rem - 10rem - 4rem - 2rem)', // Account for logo(5rem) + nav(10rem) + user box(4rem) + sessions header(2rem)
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9'
        }}
      >
        {displayedConversations.map((conversation, index) => (
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
            <div 
              className="relative group"
              onMouseEnter={() => dispatch(setHoveredId(conversation.id))}
              onMouseLeave={() => dispatch(setHoveredId(null))}
            >
              {editingId === conversation.id ? (
                // Edit mode
                <div className="px-3 py-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => dispatch(setEditValue(e.target.value))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(conversation.id);
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    onBlur={() => handleSaveEdit(conversation.id)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
              ) : (
                // Normal mode
                <>
                  <button
                    onClick={async () => {
                      await dispatch(switchConversation(conversation.id));
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      activeConversation?.id === conversation.id
                        ? 'bg-gray-100 text-black shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`min-w-0 flex-1 ${
                        hoveredId === conversation.id || menuOpenId === conversation.id 
                          ? 'pr-8' 
                          : 'pr-0'
                      }`}>
                        <div className="truncate font-medium">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {formatTimestamp(conversation.updatedAt)} • {conversation.messages.length} messages
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Three dots menu button */}
                  <button
                    ref={(el) => { menuButtonRefs.current[conversation.id] = el; }}
                    onClick={(e) => handleMenuClick(e, conversation.id)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 ${
                      hoveredId === conversation.id || menuOpenId === conversation.id 
                        ? 'opacity-100' 
                        : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    <DotsThreeVertical size={16} className="text-gray-600" />
                  </button>
                </>
              )}
            </div>
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

      {/* Dropdown menu rendered with portal */}
      {menuOpenId && menuPosition && createPortal(
        <div 
          className="fixed w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[9999]"
          style={{ 
            top: `${menuPosition.top}px`, 
            left: `${menuPosition.left}px` 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const conversation = conversations.find(c => c.id === menuOpenId);
              if (conversation) {
                handleStartEdit(conversation.id, conversation.title);
              }
            }}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <Pencil size={16} className="text-gray-600" />
            <span>Rename</span>
          </button>
          <button
            onClick={() => handleDelete(menuOpenId)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
          >
            <Trash size={16} />
            <span>Delete</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChatSessions;