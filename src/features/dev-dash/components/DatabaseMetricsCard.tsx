import React from 'react';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { DatabaseMetrics } from '../types';

interface DatabaseMetricsCardProps {
  databaseMetrics: DatabaseMetrics | null;
  loading: boolean;
  error: string | null;
}

export const DatabaseMetricsCard: React.FC<DatabaseMetricsCardProps> = ({
  databaseMetrics,
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
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Database Metrics</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!databaseMetrics) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-sm text-gray-500">Database metrics not found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Metrics</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Total Topics</p>
              <p className="text-xs text-gray-600">Available in library</p>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {databaseMetrics.totalTopics.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Progress Records</p>
              <p className="text-xs text-gray-600">User practice sessions</p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {databaseMetrics.totalProgress.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Completion Rate</p>
              <p className="text-xs text-gray-600">Average across all users</p>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {databaseMetrics.avgCompletionRate}%
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Database statistics • Updated in real-time
        </div>
      </div>
    </Card>
  );
};