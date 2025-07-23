import React from 'react';
import { CheckCircle } from 'phosphor-react';

export const CompleteView: React.FC = () => {
  return (
    <div className="text-center space-y-6">
      <CheckCircle size={48} className="text-green-500 mx-auto" />
      <div>
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          Practice Complete
        </h2>
        <p className="text-gray-600">
          Well done on your pronunciation practice
        </p>
      </div>
    </div>
  );
};