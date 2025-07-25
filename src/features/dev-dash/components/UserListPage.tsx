import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { openUserDetailModal } from '../devDashSlice';
import { Card } from '../../../shared/components/layout/ui/card';
import { Skeleton } from '../../../shared/components/layout/ui/skeleton';
import { UserDetail } from '../types';

interface UserListPageProps {
  userDetails: UserDetail[] | null;
  loading: boolean;
  error: string | null;
  onFetchUserDetails: () => void;
}

export const UserListPage: React.FC<UserListPageProps> = ({
  userDetails,
  loading,
  error,
  onFetchUserDetails,
}) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // Debug log to see what data we're receiving

  const handleUserClick = (user: UserDetail) => {
    dispatch(openUserDetailModal(user));
  };

  useEffect(() => {
    if (!userDetails && !loading && !error) {
      onFetchUserDetails();
    }
  }, [userDetails, loading, error, onFetchUserDetails]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Error Loading User List</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onFetchUserDetails}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading Users
          </button>
        </Card>
      </div>
    );
  }

  if (!userDetails || userDetails.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">No Users Found</h3>
          <p className="text-gray-500 mb-6">No user data is available at the moment.</p>
          <button
            onClick={onFetchUserDetails}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Users
          </button>
        </Card>
      </div>
    );
  }

  // Filter users based on search term
  const filteredUsers = userDetails.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.country && user.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User List</h2>
          <p className="text-gray-600 mt-1">Complete list of registered users</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filteredUsers.length} of {userDetails.length} users
        </div>
      </div>

      {/* Search and Stats */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by email, name, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={onFetchUserDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Refresh Data
          </button>
        </div>
      </Card>

      {/* User List */}
      <Card className="p-6">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg font-medium text-sm text-gray-700 mb-4">
          <div>Email & Name</div>
          <div>Signup Date</div>
          <div>Location</div>
          <div>IELTS Info</div>
          <div>Conversations</div>
        </div>

        {/* User Rows */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="grid grid-cols-5 gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              {/* Email & Name */}
              <div className="space-y-1">
                <div className="font-medium text-gray-900 truncate">{user.email}</div>
                <div className="text-sm text-gray-600 truncate">
                  {user.full_name || user.username || 'No name provided'}
                </div>
              </div>
              
              {/* Signup Date */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(user.created_at)}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                </div>
              </div>
              
              {/* Location */}
              <div className="space-y-1">
                <div className="text-sm text-gray-900">
                  {user.country ? `📍 ${user.country}` : '🌍 Not specified'}
                </div>
              </div>
              
              {/* IELTS Info */}
              <div className="space-y-1">
                {user.target_band_score && (
                  <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-block">
                    🎯 Target: {user.target_band_score}
                  </div>
                )}
                {user.current_level && (
                  <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full inline-block capitalize">
                    📊 {user.current_level}
                  </div>
                )}
                {!user.target_band_score && !user.current_level && (
                  <div className="text-xs text-gray-500">No IELTS info</div>
                )}
              </div>
              
              {/* Conversations */}
              <div className="space-y-1">
                <div className="text-center">
                  <div className={`text-lg font-bold mb-1 ${
                    (user.conversationCount || 0) > 0 ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {user.conversationCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(user.conversationCount || 0) === 1 ? 'conversation' : 'conversations'}
                  </div>
                </div>
                {(user.conversationCount || 0) > 0 && (
                  <div className="text-xs text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      ✓ Active
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No users found matching "{searchTerm}"</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search terms</p>
          </div>
        )}
      </Card>
    </div>
  );
};