-- Create Storage Policies for Avatars Bucket
-- Run this after creating the 'avatars' bucket in Supabase Storage dashboard

-- First, create the bucket in Supabase Dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name it 'avatars'
-- 4. Make it a PUBLIC bucket
-- 5. Click "Create bucket"
-- 6. Then run this SQL to set up the policies

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public avatar access" ON storage.objects;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view avatars (public access)
CREATE POLICY "Public avatar access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Verify the policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatar%';