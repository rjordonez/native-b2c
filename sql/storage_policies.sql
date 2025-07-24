-- Supabase Storage Configuration for Avatars
-- Run this in the Supabase SQL editor after creating the storage bucket

-- Create the avatars bucket (do this in Supabase Dashboard first)
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket called "avatars"
-- 3. Make it PUBLIC for read access
-- 4. Set file size limit to 5MB
-- 5. Set allowed MIME types to: image/jpeg, image/png, image/webp

-- Storage policies for the avatars bucket
-- These policies control who can upload, update, and delete avatar images

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Anyone can view avatars (public read access)
CREATE POLICY "Public avatar access" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Note: File structure will be: avatars/{user_id}/avatar.{extension}
-- This ensures each user can only modify their own avatar