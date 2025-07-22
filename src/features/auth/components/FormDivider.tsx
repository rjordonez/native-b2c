import React from 'react';

const FormDivider: React.FC = () => {
  return (
    <div className="my-6 flex items-center">
      <div className="flex-1 border-t border-gray-200"></div>
      <span className="px-4 text-gray-500 text-sm">or</span>
      <div className="flex-1 border-t border-gray-200"></div>
    </div>
  );
};

export default FormDivider;