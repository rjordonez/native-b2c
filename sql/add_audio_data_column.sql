-- Add audio_data column to messages table for storing base64 audio
-- This is for Phase 1 persistence before implementing cloud storage in Phase 2

-- Add the audio_data column to store base64 encoded audio
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS audio_data TEXT;

-- Add a comment to explain the purpose
COMMENT ON COLUMN messages.audio_data IS 'Base64 encoded audio data for voice messages (temporary solution for Phase 1)';