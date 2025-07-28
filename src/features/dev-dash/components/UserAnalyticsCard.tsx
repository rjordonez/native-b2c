import React from 'react';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { UserAnalytics } from '../types';

interface UserAnalyticsCardProps {
  userAnalytics: UserAnalytics | null;
  loading: boolean;
  error: string | null;
}

export const UserAnalyticsCard: React.FC<UserAnalyticsCardProps> = ({
  userAnalytics,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-8 w-1/2" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading User Analytics</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </Card>
    );
  }

  if (!userAnalytics) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Available</h3>
          <p className="text-sm text-gray-500">User analytics data not found</p>
        </div>
      </Card>
    );
  }

  const formatGrowthRate = (rate: number) => {
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">User Analytics</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Growth:</span>
            <span className={`text-sm font-medium ${getGrowthColor(userAnalytics.growthRate)}`}>
              {formatGrowthRate(userAnalytics.growthRate)}
            </span>
          </div>
        </div>

        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {userAnalytics.totalUsers.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Total Unique Users</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {userAnalytics.newUsersToday}
            </div>
            <p className="text-xs text-gray-600">Today</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {userAnalytics.newUsersThisWeek}
            </div>
            <p className="text-xs text-gray-600">This Week</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-1">
              {userAnalytics.newUsersThisMonth}
            </div>
            <p className="text-xs text-gray-600">This Month</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className={`text-2xl font-semibold mb-1 ${getGrowthColor(userAnalytics.growthRate)}`}>
              {formatGrowthRate(userAnalytics.growthRate)}
            </div>
            <p className="text-xs text-gray-600">Growth Rate</p>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </Card>
  );
};