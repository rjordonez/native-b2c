-- Phase 2: Audio & Transcription Schema
-- This migration adds support for proper audio storage and transcription/pronunciation data

-- Update messages table to replace audio_data with proper audio storage
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS audio_storage_url TEXT,
ADD COLUMN IF NOT EXISTS audio_duration INTEGER,
ADD COLUMN IF NOT EXISTS audio_mime_type TEXT;

-- Create transcriptions table
CREATE TABLE IF NOT EXISTS transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  confidence FLOAT,
  transcript_id TEXT, -- External service transcript ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id)
);

-- Create pronunciation_scores table
CREATE TABLE IF NOT EXISTS pronunciation_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  overall_score FLOAT NOT NULL,
  accuracy_score FLOAT NOT NULL,
  fluency_score FLOAT NOT NULL,
  completeness_score FLOAT NOT NULL,
  word_scores JSONB, -- Array of word-level scores
  phoneme_scores JSONB, -- Array of phoneme-level scores
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id)
);

-- Create enhanced_transcripts table
CREATE TABLE IF NOT EXISTS enhanced_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  enhanced_text TEXT NOT NULL,
  original_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transcriptions_message_id ON transcriptions(message_id);
CREATE INDEX IF NOT EXISTS idx_pronunciation_scores_message_id ON pronunciation_scores(message_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_transcripts_message_id ON enhanced_transcripts(message_id);

-- Enable RLS for new tables
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_transcripts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transcriptions
CREATE POLICY "Users can view own transcriptions" ON transcriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = transcriptions.message_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transcriptions for own messages" ON transcriptions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = transcriptions.message_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for pronunciation_scores
CREATE POLICY "Users can view own pronunciation scores" ON pronunciation_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = pronunciation_scores.message_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create pronunciation scores for own messages" ON pronunciation_scores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = pronunciation_scores.message_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- RLS Policies for enhanced_transcripts
CREATE POLICY "Users can view own enhanced transcripts" ON enhanced_transcripts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = enhanced_transcripts.message_id 
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create enhanced transcripts for own messages" ON enhanced_transcripts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages 
      JOIN conversations ON conversations.id = messages.conversation_id
      WHERE messages.id = enhanced_transcripts.message_id 
      AND conversations.user_id = auth.uid()
    )
  );

-- Storage bucket for audio files (create this in Supabase dashboard)
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket called 'chat-audio'
-- 3. Set it to private (authenticated users only)
-- 4. Add the following RLS policies:
--    - SELECT: authenticated users can view their own files
--    - INSERT: authenticated users can upload files
--    - DELETE: authenticated users can delete their own files

-- Comment on the migration
COMMENT ON TABLE transcriptions IS 'Stores transcription results from speech-to-text services';
COMMENT ON TABLE pronunciation_scores IS 'Stores pronunciation analysis results from Azure Speech';
COMMENT ON TABLE enhanced_transcripts IS 'Stores AI-enhanced versions of transcripts';
COMMENT ON COLUMN messages.audio_storage_url IS 'URL to audio file in Supabase Storage (replaces audio_data base64)';