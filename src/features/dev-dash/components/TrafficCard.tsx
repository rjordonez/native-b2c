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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {trafficData.totalVisits.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Visits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {trafficData.totalConversions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Conversions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {trafficData.overallConversionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Traffic Sources</h3>
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
                    <div className="font-medium">{source.visits.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">
                      {source.conversionRate.toFixed(1)}% conv.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UTM Link */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Tracking Link</h4>
            <div className="text-sm text-blue-700 break-all">
              https://www.nativespeaking.ai?utm_source=threads&utm_medium=social&utm_campaign=productlaunch
            </div>
            <div className="text-xs text-blue-600 mt-1">
              Use this link to track traffic from social media campaigns
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 