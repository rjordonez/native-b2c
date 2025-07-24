import React, { useState, useRef, useEffect } from 'react';
import { Sliders, Sparkle, TextAa } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectActiveConversation } from '../../store/conversationSlice';

interface ToolsDropdownProps {}

const ToolsDropdown: React.FC<ToolsDropdownProps> = () => {
  const dispatch = useAppDispatch();
  const activeConversation = useAppSelector(selectActiveConversation);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`Tools action: ${action}`);
    setIsOpen(false);
    
    switch (action) {
      case 'enhance':
        // TODO: Implement enhance functionality
        break;
      case 'shadow-sentence':
        // TODO: Implement shadow sentence functionality
        break;
      default:
        console.log(`Action ${action} not implemented`);
    }
  };

  const menuItems = [
    { id: 'enhance', label: 'Enhance', icon: Sparkle },
    { id: 'shadow-sentence', label: 'Shadow Sentence', icon: TextAa },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tools Pill Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium rounded-full transition-colors"
      >
        <Sliders size={16} />
        <span>Tools</span>
      </button>

      {/* Dropdown Panel - Popup Up */}
      <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 transform transition-all duration-200 ease-out ${
        isOpen 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
      }`}>
        <div className="py-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isFirst = index === 0;
            const isLast = index === menuItems.length - 1;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                className={`w-full flex items-center px-4 py-2 text-sm bg-primary text-white hover:bg-primary/90 transition-colors ${
                  isFirst ? 'rounded-t-lg' : ''
                } ${isLast ? 'rounded-b-lg' : ''}`}
              >
                <Icon size={16} className="mr-2" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolsDropdown;