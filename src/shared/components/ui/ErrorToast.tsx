import React, { useEffect } from 'react';
import { X, Warning } from 'phosphor-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectSaveError, clearError } from '../../../store/slices/saveStatusSlice';

interface ErrorToastProps {
  duration?: number; // milliseconds
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ duration = 5000 }) => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectSaveError);

  useEffect(() => {
    if (error && duration > 0) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [error, duration, dispatch]);

  if (!error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-2 fade-in">
      <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Warning className="h-5 w-5 text-red-500" weight="fill" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => dispatch(clearError())}
            className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};