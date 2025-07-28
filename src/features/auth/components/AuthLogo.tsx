import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthLogo: React.FC = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center mb-8">
      <img 
        src="/native-logo.png" 
        alt="Logo" 
        className="h-8 mr-3 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      />
     
    </div>
  );
};

export default AuthLogo;