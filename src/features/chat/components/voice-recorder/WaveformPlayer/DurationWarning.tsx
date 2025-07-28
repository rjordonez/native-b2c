import React from 'react';

interface DurationWarningProps {
  totalDuration: number;
  minimumDuration: number;
}

export const DurationWarning: React.FC<DurationWarningProps> = ({
  totalDuration,
  minimumDuration
}) => {
  return (
    <div className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
      Recording too short: {Math.floor(totalDuration)}s / {minimumDuration}s minimum
    </div>
  );
};