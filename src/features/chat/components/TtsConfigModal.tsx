import React from 'react';
import { X, Gear } from 'phosphor-react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { selectTtsSpeed, selectTtsVoice, setTtsSpeed, setTtsVoice } from '../chatSlice';

interface TtsConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
];

const voiceOptions = [
  { label: 'Journey (Female)', value: 'en-US-Journey-F' },
  { label: 'Journey (Male)', value: 'en-US-Journey-D' },
  { label: 'Neural2 (Female)', value: 'en-US-Neural2-A' },
  { label: 'Neural2 (Male)', value: 'en-US-Neural2-D' },
  { label: 'Standard (Female)', value: 'en-US-Standard-C' },
  { label: 'Standard (Male)', value: 'en-US-Standard-B' },
];

const TtsConfigModal: React.FC<TtsConfigModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const ttsSpeed = useAppSelector(selectTtsSpeed);
  const ttsVoice = useAppSelector(selectTtsVoice);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-20 right-4 bg-white rounded-lg shadow-xl z-50 w-80">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gear size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold">Voice Configuration</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice
            </label>
            <select
              value={ttsVoice}
              onChange={(e) => dispatch(setTtsVoice(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {voiceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Speed Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speaking Rate
            </label>
            <select
              value={ttsSpeed}
              onChange={(e) => dispatch(setTtsSpeed(parseFloat(e.target.value)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {speedOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Info text */}
          <p className="text-xs text-gray-500">
            These settings apply to AI-generated voice responses in the chat.
          </p>
        </div>
      </div>
    </>
  );
};

export default TtsConfigModal;