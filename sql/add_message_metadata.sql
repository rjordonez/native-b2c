-- Add metadata column to messages table for storing action buttons and other data
-- This column will store JSON data for flexibility

-- Add metadata column if it doesn't exist
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Add index for better query performance on metadata
CREATE INDEX IF NOT EXISTS idx_messages_metadata 
ON messages USING gin(metadata);

-- Comment for documentation
COMMENT ON COLUMN messages.metadata IS 'Stores additional message data like action buttons, IELTS scores, etc.';