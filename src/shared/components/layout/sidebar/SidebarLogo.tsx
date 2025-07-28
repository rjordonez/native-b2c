import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { 
  toggleSidebarCollapse, 
  selectSidebarCollapsed, 
  selectHoveredItem, 
  selectTooltipPosition,
  setHoveredItem,
  setTooltipPosition
} from '../../../../store/slices/navigationSlice';

const SidebarLogo: React.FC = () => {
  const dispatch = useAppDispatch();
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed);
  const hoveredItem = useAppSelector(selectHoveredItem);
  const tooltipPosition = useAppSelector(selectTooltipPosition);

  // Use primary color for gradient (from CSS variable)
  const gradientStyle = {
    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6))',
  };

  const handleMouseEnter = (e: React.MouseEvent, itemId: string) => {
    dispatch(setHoveredItem(itemId));
    const rect = e.currentTarget.getBoundingClientRect();
    
    if (itemId === 'collapse') {
      // Position below for collapse button
      dispatch(setTooltipPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2
      }));
    } else {
      // Position to the right for collapsed logo
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
    dispatch(toggleSidebarCollapse());
  };

  if (sidebarCollapsed) {
    return (
      <div className="relative">
        {/* N Logo - always present */}
        <button 
          onClick={handleClick}
          onMouseEnter={(e) => handleMouseEnter(e, 'logo')}
          onMouseLeave={handleMouseLeave}
          className={`w-10 h-10 rounded-md flex items-center justify-center hover:opacity-90 transition-opacity duration-200 ${
            hoveredItem === 'logo' ? 'opacity-0' : 'opacity-100'
          }`}
          style={gradientStyle}
        >
          <span className="text-white text-lg font-bold">N</span>
        </button>

        {/* Split Screen Icon - shows on hover */}
        <button
          onClick={handleClick}
          onMouseEnter={(e) => handleMouseEnter(e, 'logo')}
          onMouseLeave={handleMouseLeave}
          className={`absolute top-0 left-0 w-10 h-10 rounded-md flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200 ${
            hoveredItem === 'logo' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>

        {/* Tooltip */}
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
    );
  }

  return (
    <>
      <img src="/native-logo.png" alt="Native Logo" className="h-7 w-auto" />
      {/* Collapse button */}
      <div className="relative">
        <button
          onClick={handleClick}
          onMouseEnter={(e) => handleMouseEnter(e, 'collapse')}
          onMouseLeave={handleMouseLeave}
          className="w-10 h-10 rounded-md flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        
        {/* Tooltip */}
        {hoveredItem === 'collapse' && tooltipPosition && (
          <div 
            className="fixed px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
            style={{ 
              top: `${tooltipPosition.top}px`, 
              left: `${tooltipPosition.left}px`,
              transform: 'translateX(-50%)'
            }}
          >
            Close sidebar
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarLogo;