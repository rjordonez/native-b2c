import React, { RefObject } from 'react';
import { Upload } from 'phosphor-react';
import { Button } from '../../../../shared/components/layout/ui/button';

interface UploadTabProps {
  previewUrl: string | null;
  error: string | null;
  isUploading: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent) => void;
  onUpload: () => void;
  onClose: () => void;
}

export const UploadTab: React.FC<UploadTabProps> = ({
  previewUrl,
  error,
  isUploading,
  fileInputRef,
  onFileSelect,
  onDrop,
  onUpload,
  onClose
}) => {
  return (
    <div className="space-y-4">
      <div
        onDrop={onDrop}
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
          onChange={onFileSelect}
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
          onClick={onUpload}
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
  );
};