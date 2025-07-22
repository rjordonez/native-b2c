import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/layout/ui/card';

interface StreaksCardProps {
  testDate: Date;
  completedDays: Date[]; 
  frequency: number; 
}

const StreaksCard: React.FC<StreaksCardProps> = ({ 
  testDate,
  frequency
}) => {
  // Calculate days left using useMemo for performance
  const daysLeft = useMemo(() => {
    const today = new Date();
    return Math.max(0, Math.ceil((testDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  }, [testDate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Streaks</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">{frequency}</div>
            <div className="text-sm text-gray-600">Days Practiced</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">{daysLeft}</div>
            <div className="text-sm text-gray-600">Days Until Test</div>
          </div>
          <div className="p-4 rounded-lg bg-orange-50">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((frequency / Math.max(1, 30 - daysLeft)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Consistency</div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="text-sm font-medium text-yellow-800">
            Test Date: {testDate.toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreaksCard;