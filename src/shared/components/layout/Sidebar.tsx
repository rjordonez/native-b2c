import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gear, DotsThree, SignOut, Plus } from 'phosphor-react';
import SplitScreenIcon from '@mui/icons-material/SplitScreen';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { signOut } from '../../../features/auth/authSlice';
import { ROUTES } from '../../../constants/routes';
import { selectUserDropdownOpen, setUserDropdownOpen, toggleUserDropdown, selectSidebarCollapsed, toggleSidebarCollapse } from '../../../store/slices/navigationSlice';
import { 
  selectConversations, 
  selectActiveConversation, 
  setActiveConversation,
  createConversation 
} from '../../../features/chat/chatSlice';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const dropdownOpen = useAppSelector(selectUserDropdownOpen);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector((state) => state.auth.user);
  const userInfoRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);
  
  // Chat-related state
  const conversations = useAppSelector(selectConversations);
  const activeConversation = useAppSelector(selectActiveConversation);
  const isChatPage = location.pathname === '/chat';

  const isActive = (path: string) => location.pathname === path;
  
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  const getDisplayName = (name?: string, email?: string) => {
    return name || email || 'User';
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
    dispatch(setUserDropdownOpen(false));
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userInfoRef.current && !userInfoRef.current.contains(event.target as Node)) {
        dispatch(setUserDropdownOpen(false));
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, dispatch]);

  // Use primary color for gradient (from CSS variable)
  const gradientStyle = {
    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))',
  };

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300 ease-out relative`}>
      {/* Logo/Collapse Button at the top */}
      <div className={`flex items-center h-20 ${sidebarCollapsed ? 'px-2 justify-center' : 'px-6 justify-between'} pt-4 pb-2 relative overflow-hidden`}>
        {sidebarCollapsed ? (
          // Square N logo for collapsed state - click to expand
          <div className="relative">
            <button 
              onClick={() => {
                setHoveredItem(null);
                dispatch(toggleSidebarCollapse());
              }}
              onMouseEnter={(e) => {
                setHoveredItem('logo');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  top: rect.top + rect.height / 2,
                  left: rect.right + 8
                });
              }}
              onMouseLeave={() => {
                setHoveredItem(null);
                setTooltipPosition(null);
              }}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              style={gradientStyle}
            >
              <span className="text-white text-lg font-bold">N</span>
            </button>
            {hoveredItem === 'logo' && tooltipPosition && (
              <div 
                className="fixed px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
                style={{ 
                  top: `${tooltipPosition.top}px`, 
                  left: `${tooltipPosition.left}px`,
                  transform: 'translateY(-50%)'
                }}
              >
                Open
              </div>
            )}
          </div>
        ) : (
          <>
            <img src="/native-logo.png" alt="Native Logo" className="h-7 w-auto" />
            {/* Collapse button */}
            <div className="relative">
              <button
                onClick={() => dispatch(toggleSidebarCollapse())}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50 transition-colors"
                title="Close sidebar"
              >
                <SplitScreenIcon sx={{ fontSize: 20, transform: 'rotate(90deg)' }} />
              </button>
            </div>
          </>
        )}
      </div>
      {/* Navigation and settings at the top */}
      <div className="flex-1 flex flex-col">
        <nav className={`py-6 overflow-y-auto ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <ul className="space-y-1">
            {ROUTES.map((route) => {
              const IconComponent = route.icon;
              return (
                <li key={route.path} className="relative">
                  <Link
                    to={route.path}
                    onMouseEnter={(e) => {
                      if (sidebarCollapsed) {
                        setHoveredItem(route.path);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltipPosition({
                          top: rect.top + rect.height / 2,
                          left: rect.right + 8
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredItem(null);
                      setTooltipPosition(null);
                    }}
                    onClick={() => {
                      setHoveredItem(null);
                      setTooltipPosition(null);
                    }}
                    className={`flex items-center ${
                      sidebarCollapsed 
                        ? 'justify-center px-2 py-3' 
                        : 'px-4 py-3'
                    } text-sm font-medium rounded-lg transition-colors ${
                      isActive(route.path)
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    <IconComponent size={20} className={sidebarCollapsed ? '' : 'mr-3'} />
                    {!sidebarCollapsed && route.name}
                  </Link>
                  {sidebarCollapsed && hoveredItem === route.path && tooltipPosition && (
                    <div 
                      className="fixed px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
                      style={{ 
                        top: `${tooltipPosition.top}px`, 
                        left: `${tooltipPosition.left}px`,
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {route.name}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Chat Sessions - Show when on chat page and not collapsed */}
        {!sidebarCollapsed && (
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
        )}
      </div>
      {/* User info at the bottom */}
      <div
        ref={userInfoRef}
        className="relative mb-4"
      >
        <button
          onClick={() => {
            if (sidebarCollapsed) {
              // If collapsed, expand sidebar first then open dropdown
              dispatch(toggleSidebarCollapse());
              setTimeout(() => {
                dispatch(setUserDropdownOpen(true));
              }, 300); // Wait for sidebar animation
            } else {
              dispatch(toggleUserDropdown());
            }
          }}
          className={`h-16 border-t border-gray-100 w-full focus:outline-none ${
            sidebarCollapsed ? 'px-2' : 'px-6'
          }`}
        >
          {sidebarCollapsed ? (
            // Collapsed state - just the avatar
            <div className="flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={gradientStyle}>
                <span className="text-white text-sm font-medium">
                  {getInitials(user?.user_metadata?.full_name, user?.email)}
                </span>
              </div>
            </div>
          ) : (
            // Expanded state - full layout
            <div className="flex items-center justify-between gap-3 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100 hover:ring-2 hover:ring-primary/30 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={gradientStyle}>
                  <span className="text-white text-sm font-medium">
                    {getInitials(user?.user_metadata?.full_name, user?.email)}
                  </span>
                </div>
                <span className="bg-white rounded-lg px-2 py-1 text-xs font-medium text-gray-900 shadow border border-gray-200">
                  {getDisplayName(user?.user_metadata?.full_name, user?.email)}
                </span>
              </div>
              <DotsThree size={22} weight="bold" className="text-gray-400" />
            </div>
          )}
        </button>
        {!sidebarCollapsed && (
          <div className={`absolute left-6 right-6 bottom-16 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 z-10 transform transition-all duration-200 ease-out ${
            dropdownOpen 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }`}>
            <Link
              to="/settings"
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
              onClick={() => dispatch(setUserDropdownOpen(false))}
            >
              <Gear size={16} className="mr-2" /> Settings
            </Link>
            <div className="border-t border-gray-100"></div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-lg transition-colors"
            >
              <SignOut size={16} className="mr-2" /> Sign out
            </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;