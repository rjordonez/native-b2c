import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { UserGrowthData } from '../types';

interface UserGrowthChartProps {
  data: UserGrowthData[] | null;
  loading: boolean;
  error: string | null;
}

type ViewMode = 'daily' | 'weekly';

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
  data,
  loading,
  error,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  
  // Process data based on view mode - must be before any conditional returns
  const chartData = useMemo(() => {
    if (!data) return [];
    
    if (viewMode === 'daily') {
      // Daily view - same as before
      let cumulative = 0;
      return data.map(item => {
        cumulative += item.count;
        return {
          ...item,
          cumulative,
          date: new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })
        };
      });
    } else {
      // Weekly view - aggregate by week (Friday to Friday)
      const weeklyData: { [key: string]: { count: number; date: string; weekStart: Date } } = {};
      
      data.forEach(item => {
        const date = new Date(item.date);
        const dayOfWeek = date.getDay();
        // Calculate the Friday of this week
        const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
        const friday = new Date(date);
        friday.setDate(date.getDate() + daysUntilFriday);
        
        // Get the start of the week (previous Saturday)
        const weekStart = new Date(friday);
        weekStart.setDate(friday.getDate() - 6);
        
        const weekKey = friday.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            count: 0,
            date: friday.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            weekStart: weekStart
          };
        }
        
        weeklyData[weekKey].count += item.count;
      });
      
      // Convert to array and sort by date
      const sortedWeeks = Object.entries(weeklyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([_, value]) => value);
      
      // Calculate cumulative
      let cumulative = 0;
      return sortedWeeks.map(week => {
        cumulative += week.count;
        return {
          ...week,
          cumulative
        };
      });
    }
  }, [data, viewMode]);

  // Calculate additional metrics - must be before any conditional returns
  const metrics = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { peak: 0, peakDate: '', lowest: 0, lowestDate: '', trend: 'stable' };
    }
    
    const counts = chartData.map(d => d.count);
    const peak = Math.max(...counts);
    const lowest = Math.min(...counts);
    const peakIndex = counts.indexOf(peak);
    const lowestIndex = counts.indexOf(lowest);
    
    // Calculate trend (comparing last 7 periods to previous 7)
    const recentAvg = chartData.slice(-7).reduce((sum, d) => sum + d.count, 0) / Math.min(7, chartData.length);
    const previousAvg = chartData.slice(-14, -7).reduce((sum, d) => sum + d.count, 0) / Math.min(7, chartData.slice(-14, -7).length);
    const trend = recentAvg > previousAvg * 1.1 ? 'up' : recentAvg < previousAvg * 0.9 ? 'down' : 'stable';
    
    return {
      peak,
      peakDate: chartData[peakIndex]?.date || '',
      lowest,
      lowestDate: chartData[lowestIndex]?.date || '',
      trend
    };
  }, [chartData]);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading User Growth</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-sm text-gray-500">User growth data not found</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">
            {viewMode === 'weekly' ? `Week ending: ${label}` : `Date: ${label}`}
          </p>
          <p className="text-blue-600">
            {`New Users: ${payload[0]?.payload?.count || 0}`}
          </p>
          <p className="text-green-600">
            {`Total Users: ${payload[0]?.payload?.cumulative || 0}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">User Growth Analytics</h3>
            <p className="text-sm text-gray-500 mt-1">
              Trend: <span className={`font-medium ${
                metrics.trend === 'up' ? 'text-green-600' : 
                metrics.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metrics.trend === 'up' ? '↑ Growing' : 
                 metrics.trend === 'down' ? '↓ Declining' : '→ Stable'}
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'daily' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'weekly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Weekly
              </button>
            </div>
            
            {/* Legend */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">New Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Total Users</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stackId="1"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorNew)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-600 font-medium">Total New Users</p>
                <div className="text-2xl font-bold text-blue-700">
                  {chartData.reduce((sum, item) => sum + item.count, 0)}
                </div>
                <p className="text-xs text-blue-500 mt-1">
                  {viewMode === 'weekly' ? 'Last 4 weeks' : 'Last 30 days'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Average</p>
                <p className="text-sm font-semibold text-gray-700">
                  {chartData.length > 0 
                    ? (chartData.reduce((sum, item) => sum + item.count, 0) / chartData.length).toFixed(1)
                    : '0'}
                  /{viewMode === 'weekly' ? 'wk' : 'day'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-green-600 font-medium">Peak {viewMode === 'weekly' ? 'Week' : 'Day'}</p>
                <div className="text-2xl font-bold text-green-700">
                  {metrics.peak}
                </div>
                <p className="text-xs text-green-500 mt-1">
                  {metrics.peakDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Lowest</p>
                <p className="text-sm font-semibold text-gray-700">
                  {metrics.lowest}
                </p>
                <p className="text-xs text-gray-500">
                  {metrics.lowestDate}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-purple-600 font-medium">Growth Rate</p>
                <div className="text-2xl font-bold text-purple-700">
                  {(() => {
                    if (chartData.length < 2) return '0%';
                    const lastPeriod = chartData[chartData.length - 1]?.count || 0;
                    const prevPeriod = chartData[chartData.length - 2]?.count || 0;
                    if (prevPeriod === 0) return lastPeriod > 0 ? '+100%' : '0%';
                    const growth = ((lastPeriod - prevPeriod) / prevPeriod * 100).toFixed(0);
                    return growth > 0 ? `+${growth}%` : `${growth}%`;
                  })()}
                </div>
                <p className="text-xs text-purple-500 mt-1">
                  vs previous {viewMode === 'weekly' ? 'week' : 'day'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-sm font-semibold text-gray-700">
                  {chartData[chartData.length - 1]?.cumulative || 0}
                </p>
                <p className="text-xs text-gray-500">users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};