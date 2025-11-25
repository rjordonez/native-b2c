import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { ROUTES } from '../../../../constants/routes';
import { 
  selectSidebarCollapsed, 
  selectHoveredItem, 
  selectTooltipPosition,
  setHoveredItem,
  setTooltipPosition,
  setMobileMenuOpen
} from '../../../../store/slices/navigationSlice';

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const hoveredItem = useAppSelector(selectHoveredItem);
  const tooltipPosition = useAppSelector(selectTooltipPosition);

  const isActive = (path: string) => location.pathname === path;

  const handleMouseEnter = (e: React.MouseEvent, routePath: string) => {
    if (sidebarCollapsed) {
      dispatch(setHoveredItem(routePath));
      const rect = e.currentTarget.getBoundingClientRect();
      dispatch(setTooltipPosition({
        top: rect.top + rect.height / 2,
        left: rect.right + 8
      }));
    }
  };

  const handleMouseLeave = () => {
    dispatch(setHoveredItem(null));
    dispatch(setTooltipPosition(null));
  };

  const handleClick = () => {
    dispatch(setHoveredItem(null));
    dispatch(setTooltipPosition(null));
    // Close mobile menu when navigating
    dispatch(setMobileMenuOpen(false));
  };

  return (
    <nav className={`py-6 overflow-y-auto ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
      <ul className="space-y-1">
        {ROUTES.map((route) => {
          const IconComponent = route.icon;
          return (
            <li key={route.path} className="relative">
              <Link
                to={route.path}
                onMouseEnter={(e) => handleMouseEnter(e, route.path)}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
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
              
              {/* Tooltip for collapsed state */}
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
  );
};

export default SidebarNavigation;