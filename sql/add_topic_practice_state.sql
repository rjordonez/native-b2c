-- Add topic practice state to conversations table
-- This allows persisting whether a conversation is in topic practice mode

-- Add columns for topic practice state
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS current_topic JSONB,
ADD COLUMN IF NOT EXISTS current_question_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS topic_questions JSONB;

-- Add comments to explain the columns
COMMENT ON COLUMN conversations.current_topic IS 'Current topic object for topic practice sessions';
COMMENT ON COLUMN conversations.current_question_index IS 'Current question index in topic practice';
COMMENT ON COLUMN conversations.topic_questions IS 'Array of questions for the current topic practice session';