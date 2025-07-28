import React, { useState, useRef } from 'react';
import { uploadAvatar, generateDefaultAvatar, updateUserAvatarUrl } from '../../../../lib/supabase/avatars';
import { useAppSelector } from '../../../../store/hooks';
import { ModalHeader } from './ModalHeader';
import { TabSelector } from './TabSelector';
import { UploadTab } from './UploadTab';
import { GradientTab } from './GradientTab';

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
        <ModalHeader onClose={onClose} />
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'upload' ? (
          <UploadTab
            previewUrl={previewUrl}
            error={error}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            onDrop={handleDrop}
            onUpload={handleUpload}
            onClose={onClose}
          />
        ) : (
          <GradientTab
            userEmail={user?.email || 'user'}
            userName={userProfile.name}
            error={error}
            isUploading={isUploading}
            onGenerateGradient={handleGenerateGradient}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AvatarUploadModal;