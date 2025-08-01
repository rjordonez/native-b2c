import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/layout/ui/card';
import { DailyTraffic } from '../types';

interface TrafficChartProps {
  data: DailyTraffic[] | null;
  loading: boolean;
  error: string | null;
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-sm">No traffic data available</div>
        </CardContent>
      </Card>
    );
  }

  const maxVisits = Math.max(...data.map(d => d.visits));
  const maxConversions = Math.max(...data.map(d => d.conversions));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 flex items-end space-x-1">
            {data.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-200 rounded-t" 
                     style={{ height: `${(day.visits / maxVisits) * 200}px` }}>
                </div>
                <div className="w-full bg-green-200 rounded-t mt-1" 
                     style={{ height: `${(day.conversions / maxConversions) * 200}px` }}>
                </div>
                <div className="text-xs text-gray-600 mt-1 transform -rotate-45 origin-left">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded"></div>
              <span>Visits</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Conversions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 