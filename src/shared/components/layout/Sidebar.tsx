import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 flex flex-col h-full">
      <div className="flex items-center h-16 px-4 bg-gray-800">
        <h2 className="text-xl font-semibold text-white">My App</h2>
      </div>
      
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {ROUTES.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(route.path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="mr-3">{route.icon}</span>
                {route.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="secondary"
          size="small"
          className="w-full"
          onClick={() => console.log('Settings clicked')}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;