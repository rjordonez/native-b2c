import React from 'react';
import { Card } from '../../../../shared/components/layout/ui/card';
import { CompleteUserData } from '../../types';

interface UserProfileOverviewProps {
  userData: CompleteUserData;
}

export const UserProfileOverview: React.FC<UserProfileOverviewProps> = ({ userData }) => {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Full Name</div>
          <div className="font-semibold text-gray-900">
            {userData.profile?.full_name || 'Not provided'}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Username</div>
          <div className="font-semibold text-gray-900">
            {userData.profile?.username || 'Not provided'}
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Country</div>
          <div className="font-semibold text-gray-900">
            {userData.profile?.country || 'Not provided'}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Target Band Score</div>
          <div className="font-semibold text-gray-900">
            {userData.profile?.target_band_score || 'Not set'}
          </div>
        </div>
      </div>
    </Card>
  );
};