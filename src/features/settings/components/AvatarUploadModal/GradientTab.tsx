import React from 'react';
import { Button } from '../../../../shared/components/layout/ui/button';
import { generateDefaultAvatar } from '../../../../lib/supabase/avatars';

interface GradientTabProps {
  userEmail: string;
  userName: string;
  error: string | null;
  isUploading: boolean;
  onGenerateGradient: () => void;
  onClose: () => void;
}

export const GradientTab: React.FC<GradientTabProps> = ({
  userEmail,
  userName,
  error,
  isUploading,
  onGenerateGradient,
  onClose
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className="w-32 h-32 mx-auto mb-4">
          <img
            src={generateDefaultAvatar(userEmail, userName)}
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
          onClick={onGenerateGradient}
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
  );
};