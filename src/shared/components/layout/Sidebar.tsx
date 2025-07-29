import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectSidebarCollapsed, selectMobileMenuOpen, setMobileMenuOpen } from '../../../store/slices/navigationSlice';
import { SidebarLogo, SidebarNavigation, ChatSessions, UserProfile } from './sidebar/index';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);

  const handleOverlayClick = () => {
    dispatch(setMobileMenuOpen(false));
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        w-screen lg:w-auto ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} 
        bg-white lg:border-r border-gray-100 flex flex-col h-full transition-transform duration-300 ease-out
        fixed lg:relative inset-0 lg:inset-auto z-50
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo/Collapse Button at the top */}
        <div className={`flex items-center h-20 ${sidebarCollapsed ? 'lg:px-2 lg:justify-center' : 'px-6 justify-between'} pt-4 pb-2 relative overflow-hidden`}>
          <SidebarLogo />
        </div>
        
        {/* Navigation and Chat Sessions */}
        <div className="flex-1 flex flex-col">
          <SidebarNavigation />
          <ChatSessions />
        </div>
        
        {/* User Profile at the bottom */}
        <UserProfile />
      </div>
    </>
  );
};

export default Sidebar;