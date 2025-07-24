-- Create Avatars Storage Bucket and Policies
-- Run this after creating the 'avatars' bucket in Supabase Storage dashboard

-- Note: First create the bucket in Supabase Dashboard:
-- 1. Go to Storage in your Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name it 'avatars'
-- 4. Make it a PUBLIC bucket
-- 5. Click "Create bucket"
-- 6. Then run this SQL to set up the policies

-- Storage policies for avatars bucket
-- These policies control who can upload, update, delete, and view avatars

-- 1. Policy: Users can upload their own avatar
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
    'avatars',
    'Users can upload own avatar',
    '{"@in": ["authenticated", "@current_user()"]}'::jsonb,
    'INSERT'
)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- 2. Policy: Users can update their own avatar
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
    'avatars',
    'Users can update own avatar',
    '{"@in": ["authenticated", "@current_user()"]}'::jsonb,
    'UPDATE'
)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- 3. Policy: Users can delete their own avatar
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
    'avatars',
    'Users can delete own avatar',
    '{"@in": ["authenticated", "@current_user()"]}'::jsonb,
    'DELETE'
)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- 4. Policy: Anyone can view avatars (public read access)
INSERT INTO storage.policies (bucket_id, name, definition, operation)
VALUES (
    'avatars',
    'Public avatar access',
    'true'::jsonb,
    'SELECT'
)
ON CONFLICT (bucket_id, name) DO NOTHING;

-- Alternative approach using SQL commands (if the above doesn't work)
-- Run these after creating the bucket:

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own avatar 1" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own avatar 1" ON storage.objects
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
CREATE POLICY "Users can delete own avatar 1" ON storage.objects
FOR DELETE TO authenticated
USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view avatars
CREATE POLICY "Public avatar access 1" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'avatars');

-- Verify the policies are created
SELECT * FROM storage.policies WHERE bucket_id = 'avatars';