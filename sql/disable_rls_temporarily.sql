-- Temporarily disable RLS for debugging
-- Run this in Supabase SQL Editor as an admin user

-- Disable RLS on all chat-related tables
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronunciation_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_transcripts DISABLE ROW LEVEL SECURITY;

-- Note: This makes all data accessible to all authenticated users
-- Only use this for debugging, then re-enable with:
-- ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;