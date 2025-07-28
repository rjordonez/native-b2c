-- Phase 2 Cleanup: Remove audio_data column after migration
-- Run this ONLY after confirming all audio has been migrated to Storage

-- First, verify that all messages with audio_data have audio_storage_url
SELECT COUNT(*) as messages_without_storage_url
FROM messages 
WHERE audio_data IS NOT NULL 
AND audio_storage_url IS NULL;

-- If the count above is 0, you can safely drop the audio_data column:
-- ALTER TABLE messages DROP COLUMN IF EXISTS audio_data;

-- Note: Don't run the DROP command until you've verified all audio is migrated!