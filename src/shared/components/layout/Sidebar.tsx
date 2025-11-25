import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectSidebarCollapsed, selectMobileMenuOpen, setMobileMenuOpen } from '../../../store/slices/navigationSlice';
import { SidebarLogo, SidebarNavigation, ChatSessions, UserProfile } from './sidebar/index';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);
  const focusTrapRef = useFocusTrap(mobileMenuOpen);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        dispatch(setMobileMenuOpen(false));
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [mobileMenuOpen, dispatch]);

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
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        ref={focusTrapRef as React.RefObject<HTMLElement>}
        className={`
          w-screen ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} 
          bg-white lg:border-r border-gray-100 flex flex-col h-full flex-shrink-0
          fixed lg:relative inset-0 lg:inset-auto z-50
          transition-transform duration-300 ease-out lg:transition-[width] lg:duration-300 lg:ease-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Main navigation"
        aria-modal={mobileMenuOpen ? "true" : undefined}
        role={mobileMenuOpen ? "dialog" : undefined}
      >
        {/* Logo/Collapse Button at the top */}
        <div className={`flex items-center h-20 ${sidebarCollapsed ? 'lg:px-2 lg:justify-center' : 'px-6 justify-between'} pt-4 pb-2 relative`}>
          <SidebarLogo />
        </div>
        
        {/* Navigation and Chat Sessions */}
        <div className="flex-1 flex flex-col">
          <SidebarNavigation />
          <ChatSessions />
        </div>
        
        {/* User Profile at the bottom */}
        <UserProfile />
      </aside>
    </>
  );
};

export default Sidebar;