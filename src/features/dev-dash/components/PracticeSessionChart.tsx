import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';

interface PracticeSessionData {
  date: string;
  sessions: number;
  completions: number;
}

interface TopicData {
  topic: string;
  sessions: number;
  color: string;
}

interface PracticeSessionChartProps {
  sessionData: PracticeSessionData[] | null;
  topicData: TopicData[] | null;
  loading: boolean;
  error: string | null;
}

export const PracticeSessionChart: React.FC<PracticeSessionChartProps> = ({
  sessionData,
  topicData,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Practice Session Data</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!sessionData || sessionData.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Practice Data Available</h3>
          <p className="text-sm text-gray-500">Practice session data not found</p>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Date: ${label}`}</p>
          <p className="text-blue-600">
            {`Sessions: ${payload[0]?.value || 0}`}
          </p>
          <p className="text-green-600">
            {`Completions: ${payload[1]?.value || 0}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{payload[0].name}</p>
          <p className="text-blue-600">
            {`Sessions: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format session data for chart
  const chartData = sessionData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }));

  // Calculate totals
  const totalSessions = sessionData.reduce((sum, item) => sum + item.sessions, 0);
  const totalCompletions = sessionData.reduce((sum, item) => sum + item.completions, 0);
  const completionRate = totalSessions > 0 ? (totalCompletions / totalSessions) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Practice Sessions Analytics</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Sessions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Completions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Trends */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Daily Practice Trends (Last 14 Days)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9ca3af"
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={11}
                    tick={{ fill: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="sessions" 
                    fill="#3b82f6" 
                    radius={[2, 2, 0, 0]}
                    name="Sessions"
                  />
                  <Bar 
                    dataKey="completions" 
                    fill="#10b981" 
                    radius={[2, 2, 0, 0]}
                    name="Completions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Topics */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Most Popular Topics</h4>
            <div className="h-48">
              {topicData && topicData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topicData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="sessions"
                      nameKey="topic"
                    >
                      {topicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No topic data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalSessions.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {totalCompletions.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Completions</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {completionRate.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>
    </Card>
  );
};