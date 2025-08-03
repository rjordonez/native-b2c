-- Add question_index field to messages table for topic practice tracking
-- This allows the IELTS scoring to work correctly after page refresh

ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS question_index INTEGER;

-- Add comment to explain the column
COMMENT ON COLUMN messages.question_index IS 'Index of the question in topic practice session (0-based)';

-- Add index for performance when querying by question_index
CREATE INDEX IF NOT EXISTS idx_messages_question_index ON messages(conversation_id, question_index)
WHERE question_index IS NOT NULL;