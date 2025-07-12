import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectStats,
  selectRecentActivity,
  addActivity,
} from './dashboardSlice';
import DashboardCard from './components/DashboardCard';
import Button from '../../shared/components/ui/Button';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectStats);
  const recentActivity = useSelector(selectRecentActivity);

  const handleAddActivity = () => {
    const newActivity = {
      id: Date.now().toString(),
      type: 'user' as const,
      message: 'Manual activity added',
      timestamp: 'Just now',
    };
    dispatch(addActivity(newActivity));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <Button variant="primary" onClick={handleAddActivity}>
          Add Activity
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon="👥"
          trend={{ value: 12, isPositive: true }}
        />
        
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          trend={{ value: 8, isPositive: true }}
        />
        
        <DashboardCard
          title="Active Projects"
          value={stats.activeProjects}
          icon="📊"
          trend={{ value: 3, isPositive: false }}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        
        <div className="p-6">
          <ul className="space-y-3">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <span className="text-lg mr-3">
                    {activity.type === 'user' ? '👤' : 
                     activity.type === 'project' ? '📋' : '💳'}
                  </span>
                  <span className="text-gray-900">{activity.message}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="primary" size="small" className="w-full">
              Create New Project
            </Button>
            <Button variant="secondary" size="small" className="w-full">
              Generate Report
            </Button>
            <Button variant="secondary" size="small" className="w-full">
              Manage Users
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>API Status</span>
              <span className="text-green-600">✓ Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database</span>
              <span className="text-green-600">✓ Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Storage</span>
              <span className="text-yellow-600">⚠ 85% Full</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;