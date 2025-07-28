import React from 'react';
import { X, ArrowRight } from 'phosphor-react';

interface ActionButtonsProps {
  canSend: boolean;
  totalDuration: number;
  minimumDuration: number;
  onClear: () => void;
  onSend: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  canSend,
  totalDuration,
  minimumDuration,
  onClear,
  onSend
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Clear button */}
      <button
        onClick={onClear}
        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 transition-colors"
        title="Clear recording"
      >
        <X size={16} />
      </button>

      {/* Send button */}
      <button
        onClick={onSend}
        disabled={!canSend}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
          canSend 
            ? 'text-white bg-blue-500 hover:bg-blue-600 cursor-pointer' 
            : 'text-gray-400 bg-gray-200 cursor-not-allowed'
        }`}
        title={canSend 
          ? "Send voice message" 
          : `Recording too short (${Math.floor(totalDuration)}s / ${minimumDuration}s minimum)`
        }
      >
        <ArrowRight size={16} />
      </button>
    </div>
  );
};