import React from 'react';

interface ProgressToggleProps {
  showProgressDots: boolean;
  onChange: (value: boolean) => void;
}

export const ProgressToggle: React.FC<ProgressToggleProps> = ({ showProgressDots, onChange }) => {
  return (
    <div className="border-t pt-4">
      <label className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Show Progress Indicators</span>
        <button
          type="button"
          onClick={() => onChange(!showProgressDots)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showProgressDots ? 'bg-primary' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showProgressDots ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
      <p className="mt-1 text-xs text-gray-500">Display progress dots during topic practice</p>
    </div>
  );
};