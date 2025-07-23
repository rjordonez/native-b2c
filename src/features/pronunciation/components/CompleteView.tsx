import React from 'react';
import { CheckCircle } from 'phosphor-react';

export const CompleteView: React.FC = () => {
  return (
    <div className="space-y-6 text-center">
      <CheckCircle size={80} className="text-green-500 mx-auto" />
      <h2 className="text-4xl font-bold text-green-500">Practice Complete!</h2>
      <p className="text-xl text-gray-400">Great job on your pronunciation practice!</p>
    </div>
  );
};