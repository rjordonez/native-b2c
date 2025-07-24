import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gear, DotsThree, SignOut } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { signOut } from '../../../../features/auth/authSlice';
import { selectProfile } from '../../../../features/settings/settingsSlice';
import { 
  selectUserDropdownOpen, 
  setUserDropdownOpen, 
  toggleUserDropdown,
  selectSidebarCollapsed,
  toggleSidebarCollapse
} from '../../../../store/slices/navigationSlice';

const UserProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const dropdownOpen = useAppSelector(selectUserDropdownOpen);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector(selectProfile);
  const userInfoRef = useRef<HTMLDivElement>(null);

  // Fallback gradient style for when no avatar is available
  const gradientStyle = {
    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))',
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };
  
  const getDisplayName = () => {
    // Only show profile name if it's not the default 'User'
    if (profile.name && profile.name !== 'User') {
      return profile.name;
    }
    // Fallback to email without domain
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
    dispatch(setUserDropdownOpen(false));
  };

  const handleProfileClick = () => {
    if (sidebarCollapsed) {
      // If collapsed, expand sidebar first then open dropdown
      dispatch(toggleSidebarCollapse());
      setTimeout(() => {
        dispatch(setUserDropdownOpen(true));
      }, 300); // Wait for sidebar animation
    } else {
      dispatch(toggleUserDropdown());
    }
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

  return (
    <div ref={userInfoRef} className="relative mb-4">
      <button
        onClick={handleProfileClick}
        className={`h-16 border-t border-gray-100 w-full focus:outline-none ${
          sidebarCollapsed ? 'px-2' : 'px-6'
        }`}
      >
        {sidebarCollapsed ? (
          // Collapsed state - just the avatar
          <div className="flex items-center justify-center py-2">
            {profile.avatarUrl ? (
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || 'User'} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={gradientStyle}>
                <span className="text-white text-sm font-medium">
                  {getInitials(profile.name, user?.email)}
                </span>
              </div>
            )}
          </div>
        ) : (
          // Expanded state - full layout
          <div className="flex items-center justify-between gap-3 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100 hover:ring-2 hover:ring-primary/30 hover:shadow-md">
            <div className="flex items-center gap-3">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={gradientStyle}>
                  <span className="text-white text-sm font-medium">
                    {getInitials(profile.name, user?.email)}
                  </span>
                </div>
              )}
              <span className="bg-white rounded-lg px-2 py-1 text-xs font-medium text-gray-900 shadow border border-gray-200">
                {getDisplayName()}
              </span>
            </div>
            <DotsThree size={22} weight="bold" className="text-gray-400" />
          </div>
        )}
      </button>
      
      {/* Dropdown Menu */}
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
  );
};

export default UserProfile;