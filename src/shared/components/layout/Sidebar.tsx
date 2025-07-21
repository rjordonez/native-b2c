import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gear } from 'phosphor-react';
import { ROUTES } from '../../../constants/routes';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <img src="/native-logo.png" alt="Native Logo" className="h-8 w-auto" />
      </div>
      
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {ROUTES.map((route) => {
            const IconComponent = route.icon;
            return (
              <li key={route.path}>
                <Link
                  to={route.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(route.path)
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                  }`}
                >
                  <IconComponent size={20} className="mr-3" />
                  {route.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/settings"
          className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-gray-100 text-black'
              : 'text-gray-600 hover:bg-gray-50 hover:text-black'
          }`}
        >
          <Gear size={20} className="mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;