import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/layout/ui/card';
import { TrafficData, TimePeriod } from '../types';

interface TrafficCardProps {
  trafficData: TrafficData | null;
  loading: boolean;
  error: string | null;
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export const TrafficCard: React.FC<TrafficCardProps> = ({ 
  trafficData, 
  loading, 
  error, 
  selectedPeriod,
  onPeriodChange
}) => {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'all', label: 'All Time' },
    { value: '30d', label: '30 Days' },
    { value: '7d', label: '7 Days' },
    { value: '1d', label: '1 Day' }
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!trafficData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 text-sm">No traffic data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Traffic Analytics</CardTitle>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => onPeriodChange(period.value)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {trafficData.totalSignups.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Signups</div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Signup Sources</h3>
            {trafficData.sources.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No UTM tracking data yet</p>
                <p className="text-xs mt-1">Start using UTM links to see signup attribution</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trafficData.sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div>
                        <div className="font-medium capitalize">{source.source}</div>
                        <div className="text-sm text-gray-600">
                          {source.medium} • {source.campaign}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{source.signups.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">signups</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}; 