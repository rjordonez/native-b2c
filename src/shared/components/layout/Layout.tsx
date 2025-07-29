import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { ErrorToast } from './ui/ErrorToast';
import { useAppDispatch } from '../../../store/hooks';
import { toggleMobileMenu } from '../../../store/slices/navigationSlice';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const handleMenuClick = () => {
    dispatch(toggleMobileMenu());
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="flex items-center h-20 bg-white border-b border-gray-100">
          {/* Mobile menu button */}
          <button
            onClick={handleMenuClick}
            className="lg:hidden ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
          
          {/* TopNav content */}
          <div className="flex-1">
            <TopNav />
          </div>
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global error toast */}
      <ErrorToast />
    </div>
  );
};

export default Layout;