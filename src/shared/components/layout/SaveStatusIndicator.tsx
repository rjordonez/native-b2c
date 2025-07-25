import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectIsSaving, selectLastSaved, selectSaveError } from '../../../store/slices/saveStatusSlice';
import { CheckCircle, CloudArrowUp, XCircle } from '@phosphor-icons/react';

const SaveStatusIndicator: React.FC = () => {
  const isSaving = useAppSelector(selectIsSaving);
  const lastSaved = useAppSelector(selectLastSaved);
  const error = useAppSelector(selectSaveError);
  const [showSaved, setShowSaved] = useState(false);

  // Debug logging
  console.log('SaveStatusIndicator state:', { isSaving, lastSaved, error, showSaved });

  // Show "Saved" message for 3 seconds after save completes
  useEffect(() => {
    if (lastSaved && !isSaving) {
      setShowSaved(true);
      const timer = setTimeout(() => setShowSaved(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastSaved, isSaving]);

  // Always show something for debugging
  return (
    <div className="flex items-center gap-2 text-sm">
      {isSaving ? (
        <>
          <CloudArrowUp className="w-4 h-4 text-gray-500 animate-pulse" />
          <span className="text-gray-500">Saving...</span>
        </>
      ) : showSaved ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-500" weight="fill" />
          <span className="text-green-600">Saved</span>
        </>
      ) : error ? (
        <>
          <XCircle className="w-4 h-4 text-red-500" weight="fill" />
          <span className="text-red-600">Save failed</span>
        </>
      ) : (
        // Show idle state for debugging
        <span className="text-gray-400 text-xs">Ready</span>
      )}
    </div>
  );
};

export default SaveStatusIndicator;