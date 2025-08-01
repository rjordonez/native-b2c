import React, { useMemo } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/components/layout/ui/card';
import { DailyTraffic, TrafficData } from '../types';

interface TrafficChartProps {
  data: DailyTraffic[] | null;
  trafficData: TrafficData | null;
  loading: boolean;
  error: string | null;
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ data, trafficData, loading, error }) => {
  // Generate colors for different UTM sources
  const sourceColors = useMemo(() => {
    const colors = [
      { bg: 'bg-blue-500', text: 'text-blue-500' },
      { bg: 'bg-green-500', text: 'text-green-500' }, 
      { bg: 'bg-purple-500', text: 'text-purple-500' },
      { bg: 'bg-orange-500', text: 'text-orange-500' },
      { bg: 'bg-red-500', text: 'text-red-500' },
      { bg: 'bg-indigo-500', text: 'text-indigo-500' },
      { bg: 'bg-pink-500', text: 'text-pink-500' },
      { bg: 'bg-yellow-500', text: 'text-yellow-500' }
    ];
    
    const colorMap: { [key: string]: { bg: string; text: string } } = {};
    
    // Get all unique sources from the data
    const allSources = new Set<string>();
    data?.forEach(day => {
      Object.keys(day.sources).forEach(source => allSources.add(source));
    });
    
    Array.from(allSources).forEach((source, index) => {
      colorMap[source] = colors[index % colors.length];
    });
    
    return colorMap;
  }, [data]);

  // Process data for better readability based on time period
  const { displayData, labelFormat } = useMemo(() => {
    if (!data || !trafficData) return { displayData: null, labelFormat: 'daily' };
    
    const timePeriod = trafficData.timePeriod;
    
    if (timePeriod === '1d' || timePeriod === '7d') {
      // 1 day or 7 days - show all days
      return { 
        displayData: data, 
        labelFormat: 'daily' as const
      };
    } else if (timePeriod === '30d') {
      // 30 days - show weekly intervals (every 7th day)
      return { 
        displayData: data.filter((_, index) => index % 7 === 0 || index === data.length - 1),
        labelFormat: 'weekly' as const
      };
    } else {
      // All time - show monthly intervals (every 30th day approximately)
      const monthlyInterval = Math.max(Math.floor(data.length / 12), 7); // Show ~12 points max
      return { 
        displayData: data.filter((_, index) => index % monthlyInterval === 0 || index === data.length - 1),
        labelFormat: 'monthly' as const
      };
    }
  }, [data, trafficData]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle>Daily Signups Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-80 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle>Daily Signups Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!displayData || displayData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle>Daily Signups Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <TrendingUp className="h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm">No signup data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxSignups = Math.max(...displayData.map(d => d.signups), 1);
  const totalSignups = data?.reduce((sum, d) => sum + d.signups, 0) || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle>Daily Signups Trend</CardTitle>
        </div>
        <div className="text-sm text-gray-600">
          {totalSignups} total signups
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-80 flex items-end justify-between space-x-3 px-2">
            {displayData.map((day, index) => {
              const sources = Object.entries(day.sources);
              const totalForDay = day.signups;
              const barHeight = maxSignups > 0 ? (totalForDay / maxSignups) * 280 : 2;
              
              return (
                <div key={index} className="flex flex-col items-center min-w-0 flex-1">
                  {/* Count above bar */}
                  {totalForDay > 0 && (
                    <div className="text-xs font-medium text-gray-700 mb-1">
                      {totalForDay}
                    </div>
                  )}
                  
                  {/* Stacked Bar */}
                  <div className="w-full flex flex-col items-center group cursor-pointer">
                    <div 
                      className="w-12 flex flex-col min-h-[2px] rounded-t relative"
                      style={{ height: `${Math.max(barHeight, 2)}px` }}
                    >
                      {/* Tooltip on hover */}
                      {totalForDay > 0 && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          <div className="text-center">
                            <div>{totalForDay} signup{totalForDay !== 1 ? 's' : ''}</div>
                            {sources.length > 1 && (
                              <div className="text-xs mt-1">
                                {sources.map(([source, count]) => (
                                  <div key={source}>
                                    {source}: {count}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Stacked segments */}
                      {sources.length > 0 ? (
                        sources.map(([source, count], segmentIndex) => {
                          const segmentHeight = (count / totalForDay) * barHeight;
                          const color = sourceColors[source]?.bg || 'bg-gray-500';
                          const isFirst = segmentIndex === 0;
                          const isLast = segmentIndex === sources.length - 1;
                          
                          return (
                            <div 
                              key={source}
                              className={`${color} w-full hover:opacity-80 transition-opacity ${
                                isFirst ? 'rounded-t' : ''
                              } ${isLast ? 'rounded-b' : ''}`}
                              style={{ height: `${Math.max(segmentHeight, 1)}px` }}
                            />
                          );
                        })
                      ) : (
                        <div className="bg-gray-300 w-full rounded" style={{ height: '2px' }} />
                      )}
                    </div>
                  </div>
                  
                  {/* Date label */}
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {labelFormat === 'monthly' ? (
                      // Monthly format: Show month and year
                      <div className="font-medium">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: '2-digit' 
                        })}
                      </div>
                    ) : labelFormat === 'weekly' ? (
                      // Weekly format: Show month and day
                      <div>
                        <div>
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </div>
                      </div>
                    ) : (
                      // Daily format: Show month and day
                      <div>
                        <div>
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric' })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend - Show UTM Sources */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">Signup Sources</h4>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {Object.entries(sourceColors).map(([source, colors]) => (
                <div key={source} className="flex items-center space-x-2 text-sm">
                  <div className={`w-3 h-3 rounded ${colors.bg}`}></div>
                  <span className="text-gray-700 capitalize">
                    {source}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 text-center mt-2">
              {displayData.length < (data?.length || 0) && (
                <span>
                  {labelFormat === 'monthly' && `Showing monthly intervals (${displayData.length} points)`}
                  {labelFormat === 'weekly' && `Showing weekly intervals (${displayData.length} points)`}
                  {labelFormat === 'daily' && `Showing all ${displayData.length} days`}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 