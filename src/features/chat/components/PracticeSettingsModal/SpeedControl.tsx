import React from 'react';
import { Slider } from '../../../../shared/components/layout/ui/slider';

interface SpeedControlProps {
  value: number;
  onChange: (value: number) => void;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Speed
      </label>
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={0.5}
          max={1.5}
          step={0.05}
          className="w-full"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">0.5x</span>
          <span className="font-medium text-gray-700">{value.toFixed(2)}x</span>
          <span className="text-xs text-gray-500">1.5x</span>
        </div>
      </div>
    </div>
  );
};