-- Create Storage Bucket for Audio Files
-- This needs to be run in Supabase SQL editor

-- Note: Storage buckets cannot be created via SQL directly.
-- You need to create the bucket through the Supabase Dashboard:
-- 
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "Create a new bucket"
-- 3. Name: chat-audio
-- 4. Public bucket: NO (keep it private)
-- 5. File size limit: 50MB (or adjust as needed)
-- 6. Allowed MIME types: audio/*
--
-- After creating the bucket, you can set up RLS policies using SQL:

-- Enable RLS on the storage.objects table for the chat-audio bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('chat-audio', 'chat-audio', false, 52428800, ARRAY['audio/*'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Note: These policies apply to the storage.objects table

-- Policy: Users can upload their own audio files
CREATE POLICY "Users can upload own audio files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'chat-audio' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view their own audio files
CREATE POLICY "Users can view own audio files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'chat-audio' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own audio files
CREATE POLICY "Users can update own audio files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  bucket_id = 'chat-audio' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own audio files
CREATE POLICY "Users can delete own audio files" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'chat-audio' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Note on file structure:
-- Files will be stored as: {user_id}/{message_id}-{timestamp}.webm
-- This ensures users can only access their own audio files