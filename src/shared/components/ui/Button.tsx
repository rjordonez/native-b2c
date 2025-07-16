import React from 'react';
import { ButtonProps } from '../../types/common';

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  const baseClasses = 'rounded-lg font-medium transition-colors duration-200 focus:outline-none border';
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 border-black',
    secondary: 'bg-white text-black hover:bg-gray-50 border-gray-200',
    danger: 'bg-white text-red-600 hover:bg-red-50 border-red-200',
  };
  
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;