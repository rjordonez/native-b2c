import React, { useState, useRef } from 'react';
import { X, Upload, Sparkle } from 'phosphor-react';
import { Button } from '../../../shared/components/layout/ui/button';
import { uploadAvatar, generateDefaultAvatar, updateUserAvatarUrl } from '../../../lib/supabase/avatars';
import { useAppSelector } from '../../../store/hooks';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl: string | null;
  onAvatarUpdate: (newAvatarUrl: string) => void;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onAvatarUpdate,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gradient'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const user = useAppSelector(state => state.auth.user);
  const userProfile = useAppSelector(state => state.settings.profile);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setError(null);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadAvatar(user.id, file);
      
      if (result.success && result.avatarUrl) {
        // Update database
        await updateUserAvatarUrl(user.id, result.avatarUrl);
        onAvatarUpdate(result.avatarUrl);
        onClose();
      } else {
        setError(result.error || 'Upload failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateGradient = async () => {
    if (!user) return;

    setIsUploading(true);
    setError(null);

    try {
      const gradientUrl = generateDefaultAvatar(
        user.email || user.id,
        userProfile.name
      );
      
      // Update database
      await updateUserAvatarUrl(user.id, gradientUrl);
      onAvatarUpdate(gradientUrl);
      onClose();
    } catch (err) {
      setError('Failed to generate gradient avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: fileInputRef.current } as any);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Change Profile Picture</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Upload size={20} className="inline mr-2" />
            Upload Image
          </button>
          <button
            onClick={() => setActiveTab('gradient')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              activeTab === 'gradient'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkle size={20} className="inline mr-2" />
            Use Gradient
          </button>
        </div>

        {/* Content */}
        {activeTab === 'upload' ? (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            >
              {previewUrl ? (
                <div className="space-y-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 rounded-full mx-auto object-cover"
                  />
                  <p className="text-sm text-gray-600">Ready to upload</p>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag & drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG or WebP. Max 5MB.
                  </p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleUpload}
                disabled={!previewUrl || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src={generateDefaultAvatar(
                    user?.email || 'user',
                    userProfile.name
                  )}
                  alt="Gradient preview"
                  className="w-full h-full rounded-full"
                />
              </div>
              <p className="text-gray-600 mb-2">
                Generate a unique gradient avatar
              </p>
              <p className="text-sm text-gray-500">
                Based on your profile information
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="default"
                className="flex-1"
                onClick={handleGenerateGradient}
                disabled={isUploading}
              >
                {isUploading ? 'Generating...' : 'Use This Gradient'}
              </Button>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUploadModal;