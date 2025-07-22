import React from 'react';

const AuthLogo: React.FC = () => {
  return (
    <div className="flex items-center mb-8">
      <img 
        src="/native-logo.png" 
        alt="Logo" 
        className="h-8 mr-3"
      />
      <span className="text-xl font-semibold text-gray-900">Native Speaking</span>
    </div>
  );
};

export default AuthLogo;