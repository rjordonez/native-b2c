
import React from 'react';
import logoImage from '../lib/images/logo.png';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img 
        src={logoImage} 
        alt="Native Logo" 
        className="h-8 w-auto"
      />
    </div>
  );
};

export default Logo;
