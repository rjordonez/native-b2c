import React from 'react';
import { SpeakerHigh } from 'phosphor-react';

interface TtsSpeedSelectorProps {
  value: number;
  onChange: (speed: number) => void;
  className?: string;
}

const speedOptions = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1x', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
];

const TtsSpeedSelector: React.FC<TtsSpeedSelectorProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SpeakerHigh size={16} className="text-gray-500" />
      <select
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {speedOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TtsSpeedSelector;