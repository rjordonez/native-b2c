import React from 'react';
import { Eye, EyeSlash } from 'phosphor-react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
  showPassword: boolean;
  placeholder: string;
  className?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  onChange,
  onToggleVisibility,
  showPassword,
  placeholder,
  className = '',
  required = false,
}) => {
  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 ${className}`}
        required={required}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;