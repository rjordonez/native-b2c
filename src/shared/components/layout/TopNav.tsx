import React from 'react';
import { Question } from 'phosphor-react';
import SaveStatusIndicator from './SaveStatusIndicator';
import { useAppDispatch } from '../../../store/hooks';
import { setHelpModalOpen } from '../../../store/slices/navigationSlice';

const TopNav: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleHelpClick = () => {
    dispatch(setHelpModalOpen(true));
  };

  return (
    <div className="h-full flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <SaveStatusIndicator />
        <button 
          onClick={handleHelpClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Question size={18} />
          Help
        </button>
      </div>
    </div>
  );
};

export default TopNav;