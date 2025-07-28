import { supabase } from '../../shared/services/supabase';
import { generateGradientAvatar, generateGradientAvatarWithInitials } from '../../utils/avatarGenerator';

const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadAvatarResult {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

/**
 * Generates a default gradient avatar for a user
 * @param email - User's email for unique gradient generation
 * @param fullName - User's full name for initials (optional)
 * @returns Data URL of the gradient avatar
 */
export function generateDefaultAvatar(email: string, fullName?: string): string {
  if (fullName) {
    return generateGradientAvatarWithInitials(email, fullName);
  }
  return generateGradientAvatar(email);
}

/**
 * Uploads a user avatar to Supabase Storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns Upload result with the public URL or error
 */
export async function uploadAvatar(userId: string, file: File): Promise<UploadAvatarResult> {
  try {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File too large. Maximum size is 5MB.',
      };
    }

    // Get file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `avatar.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Delete existing avatar if any
    await deleteAvatar(userId);

    // Upload new avatar
    const { data, error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error('Avatar upload error:', error);
      return {
        success: false,
        error: 'Failed to upload avatar. Please try again.',
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    return {
      success: true,
      avatarUrl: publicUrl,
    };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Deletes a user's avatar from Supabase Storage
 * @param userId - The user's ID
 */
export async function deleteAvatar(userId: string): Promise<void> {
  try {
    // List all files in user's folder
    const { data: files } = await supabase.storage
      .from(AVATAR_BUCKET)
      .list(userId);

    if (files && files.length > 0) {
      // Delete all avatar files
      const filesToDelete = files.map(file => `${userId}/${file.name}`);
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove(filesToDelete);
    }
  } catch (error) {
    console.error('Error deleting avatar:', error);
    // Don't throw, as this is often called before upload
  }
}

/**
 * Updates the user's avatar URL in the database
 * @param userId - The user's ID
 * @param avatarUrl - The new avatar URL (can be gradient data URL or storage URL)
 * @returns Success boolean
 */
export async function updateUserAvatarUrl(userId: string, avatarUrl: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ avatar_url: avatarUrl })
      .eq('auth_user_id', userId);

    if (error) {
      console.error('Error updating avatar URL:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating avatar URL:', error);
    return false;
  }
}

/**
 * Gets the user's current avatar URL from the database
 * @param userId - The user's ID
 * @returns The avatar URL or null
 */
export async function getUserAvatarUrl(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('avatar_url')
      .eq('auth_user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.avatar_url;
  } catch (error) {
    console.error('Error fetching avatar URL:', error);
    return null;
  }
}