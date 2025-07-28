import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectSidebarCollapsed } from '../../../store/slices/navigationSlice';
import { SidebarLogo, SidebarNavigation, ChatSessions, UserProfile } from './sidebar/index';

const Sidebar: React.FC = () => {
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-100 flex flex-col h-full transition-all duration-300 ease-out relative`}>
      {/* Logo/Collapse Button at the top */}
      <div className={`flex items-center h-20 ${sidebarCollapsed ? 'px-2 justify-center' : 'px-6 justify-between'} pt-4 pb-2 relative overflow-hidden`}>
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
  );
};

export default Sidebar;