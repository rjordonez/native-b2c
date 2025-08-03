import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  fetchUserAnalytics, 
  fetchDatabaseMetrics, 
  fetchSystemStats,
  fetchUserDetails,
  fetchUserGrowthData,
  fetchPracticeSessionData,
  fetchTopicData,
  fetchTrafficData,
  clearErrors 
} from './devDashSlice';
import { 
  UserAnalyticsCard, 
  DatabaseMetricsCard, 
  SystemStatsCard, 
  UserGrowthChart, 
  PracticeSessionChart, 
  UserListPage, 
  UserDetailModal,
  TrafficCard,
  TrafficChart,
  SupportTickets
} from './components';
import { Button } from '../../shared/components/layout/ui/button';
import { TimePeriod } from './types';

type TabType = 'overview' | 'users' | 'traffic' | 'tickets';

export const DevDashPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [trafficTimePeriod, setTrafficTimePeriod] = useState<TimePeriod>('30d');
  
  const { 
    userAnalytics, 
    databaseMetrics, 
    systemStats,
    userDetails,
    userGrowthData,
    practiceSessionData,
    topicData,
    trafficData,
    loading, 
    error 
  } = useAppSelector((state) => state.devDash);

  useEffect(() => {
    // Load all dashboard data on mount
    dispatch(fetchUserAnalytics());
    dispatch(fetchDatabaseMetrics());
    dispatch(fetchSystemStats());
    dispatch(fetchUserGrowthData());
    dispatch(fetchPracticeSessionData());
    dispatch(fetchTopicData());
    dispatch(fetchTrafficData(trafficTimePeriod));

    // Clear any previous errors
    dispatch(clearErrors());
  }, [dispatch, trafficTimePeriod]);

  const handleRefresh = () => {
    dispatch(clearErrors());
    dispatch(fetchUserAnalytics());
    dispatch(fetchDatabaseMetrics());
    dispatch(fetchSystemStats());
    dispatch(fetchUserGrowthData());
    dispatch(fetchPracticeSessionData());
    dispatch(fetchTopicData());
    dispatch(fetchTrafficData(trafficTimePeriod));
  };

  const isAnyLoading = loading.userAnalytics || loading.databaseMetrics || loading.systemStats || loading.userGrowthData || loading.practiceSessionData || loading.topicData || loading.trafficData;

  const handleFetchUserDetails = () => {
    dispatch(fetchUserDetails());
  };

  const handleTrafficPeriodChange = (period: TimePeriod) => {
    setTrafficTimePeriod(period);
    dispatch(fetchTrafficData(period));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dev Dashboard</h1>
              <p className="text-gray-600 mt-1">Analytics and system monitoring for IELTS Native</p>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isAnyLoading}
              className="px-4 py-2"
            >
              {isAnyLoading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              User List
            </button>
            <button
              onClick={() => setActiveTab('traffic')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'traffic'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Traffic
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'tickets'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Support Tickets
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Row - User Analytics and System Health */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Primary metric - User Analytics */}
              <div className="xl:col-span-2">
                <UserAnalyticsCard
                  userAnalytics={userAnalytics}
                  loading={loading.userAnalytics}
                  error={error.userAnalytics}
                />
              </div>

              {/* System Health */}
              <div>
                <SystemStatsCard
                  systemStats={systemStats}
                  loading={loading.systemStats}
                  error={error.systemStats}
                />
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Growth Chart */}
              <UserGrowthChart
                data={userGrowthData}
                loading={loading.userGrowthData}
                error={error.userGrowthData}
              />

              {/* Practice Session Chart */}
              <PracticeSessionChart
                sessionData={practiceSessionData}
                topicData={topicData}
                loading={loading.practiceSessionData || loading.topicData}
                error={error.practiceSessionData || error.topicData}
              />
            </div>

            {/* Database Metrics */}
            <div>
              <DatabaseMetricsCard
                databaseMetrics={databaseMetrics}
                loading={loading.databaseMetrics}
                error={error.databaseMetrics}
              />
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserListPage
            userDetails={userDetails}
            loading={loading.userDetails}
            error={error.userDetails}
            onFetchUserDetails={handleFetchUserDetails}
          />
        )}

        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Traffic Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TrafficCard
                trafficData={trafficData}
                loading={loading.trafficData}
                error={error.trafficData}
                selectedPeriod={trafficTimePeriod}
                onPeriodChange={handleTrafficPeriodChange}
              />
              
              <TrafficChart
                data={trafficData?.dailyTraffic || null}
                trafficData={trafficData}
                loading={loading.trafficData}
                error={error.trafficData}
              />
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <SupportTickets />
        )}

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-blue-700">Live data from Supabase</span>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal />
    </div>
  );
};