-- Re-enable RLS after debugging
-- Run this in Supabase SQL Editor when you want to restore security

-- Re-enable RLS on all chat-related tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pronunciation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_transcripts ENABLE ROW LEVEL SECURITY;

-- The existing policies will automatically take effect again