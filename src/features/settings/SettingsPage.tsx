import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { User, Camera } from 'phosphor-react';
import { selectProfile, updateProfile, fetchUserProfile } from './settingsSlice';
import { Button } from '../../shared/components/layout/ui/button';
import AvatarUploadModal from './components/AvatarUploadModal';
import { generateDefaultAvatar } from '../../lib/supabase/avatars';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfile);
  const user = useAppSelector(state => state.auth.user);
  
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [dispatch, user]);

  const handleNameSave = () => {
    dispatch(updateProfile({ name: tempName }));
    setEditingName(false);
  };

  const handleNameCancel = () => {
    setTempName(profile.name);
    setEditingName(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <User size={24} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-black">Profile</h2>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profile.avatarUrl || generateDefaultAvatar(user?.email || 'user', profile.name)}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <button 
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
              >
                <Camera size={16} />
              </button>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">JPG, PNG or WebP. Max 5MB.</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            {editingName ? (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <Button variant="default" size="sm" onClick={handleNameSave}>
                  Save
                </Button>
                <Button variant="secondary" size="sm" onClick={handleNameCancel}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-gray-900">{profile.name}</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setEditingName(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatarUrl={profile.avatarUrl}
        onAvatarUpdate={(newAvatarUrl) => {
          dispatch(updateProfile({ avatarUrl: newAvatarUrl }));
        }}
      />
    </div>
  );
};

export default SettingsPage;