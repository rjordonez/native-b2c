import React from 'react';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { SystemStats } from '../types';

interface SystemStatsCardProps {
  systemStats: SystemStats | null;
  loading: boolean;
  error: string | null;
}

export const SystemStatsCard: React.FC<SystemStatsCardProps> = ({
  systemStats,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading System Stats</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!systemStats) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-sm text-gray-500">System stats not found</p>
        </div>
      </Card>
    );
  }

  const getUptimeColor = (uptime: string) => {
    const percentage = parseFloat(uptime.replace('%', ''));
    if (percentage >= 99.5) return 'text-green-600';
    if (percentage >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime <= 100) return 'text-green-600';
    if (responseTime <= 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate <= 1) return 'text-green-600';
    if (errorRate <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">System Uptime</p>
              <p className="text-xs text-gray-600">Last 30 days</p>
            </div>
            <div className={`text-2xl font-bold ${getUptimeColor(systemStats.uptime)}`}>
              {systemStats.uptime}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Response Time</p>
              <p className="text-xs text-gray-600">Average API response</p>
            </div>
            <div className={`text-2xl font-bold ${getResponseTimeColor(systemStats.responseTime)}`}>
              {systemStats.responseTime}ms
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Error Rate</p>
              <p className="text-xs text-gray-600">Failed requests</p>
            </div>
            <div className={`text-2xl font-bold ${getErrorRateColor(systemStats.errorRate)}`}>
              {systemStats.errorRate}%
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(systemStats.lastUpdated).toLocaleString()}
        </div>
      </div>
    </Card>
  );
};