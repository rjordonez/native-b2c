-- Support Ticket System for IELTS App
-- Allows users to submit help requests, track status, and receive support

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS ticket_messages CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TYPE IF EXISTS ticket_status;
DROP TYPE IF EXISTS ticket_priority;
DROP TYPE IF EXISTS ticket_category;

-- Create ENUM types for ticket properties
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting_on_user', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE ticket_category AS ENUM (
  'technical_issue',
  'account_problem', 
  'billing_question',
  'feature_request',
  'pronunciation_issue',
  'transcription_issue',
  'scoring_question',
  'general_help',
  'bug_report',
  'other'
);

-- Main support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number SERIAL UNIQUE, -- Human-readable ticket number
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category ticket_category NOT NULL DEFAULT 'general_help',
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  
  -- Metadata
  browser_info TEXT, -- User agent string
  app_version TEXT, -- App version for debugging
  page_url TEXT, -- Where the user was when they submitted
  
  -- Assignment and resolution
  assigned_to UUID REFERENCES auth.users(id), -- Support agent assigned
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_user_message_at TIMESTAMPTZ DEFAULT NOW(),
  last_agent_message_at TIMESTAMPTZ,
  
  -- Search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(subject, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED
);

-- Messages/replies within tickets
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT FALSE, -- Internal notes not visible to users
  
  -- Attachments (store URLs to uploaded files)
  attachments JSONB DEFAULT '[]'::jsonb, -- Array of {url, filename, size, type}
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  
  -- Track if user has read the message
  read_by_user BOOLEAN DEFAULT FALSE,
  read_by_user_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status) WHERE status != 'closed';
CREATE INDEX idx_tickets_assigned_to ON support_tickets(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX idx_tickets_updated_at ON support_tickets(updated_at DESC);
CREATE INDEX idx_tickets_search ON support_tickets USING GIN(search_vector);
CREATE INDEX idx_tickets_category ON support_tickets(category);
CREATE INDEX idx_tickets_priority ON support_tickets(priority) WHERE status IN ('open', 'in_progress');

CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_messages_sender_id ON ticket_messages(sender_id);
CREATE INDEX idx_ticket_messages_created_at ON ticket_messages(created_at DESC);
CREATE INDEX idx_ticket_messages_unread ON ticket_messages(ticket_id, read_by_user) WHERE read_by_user = FALSE;

-- Enable Row Level Security
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for support_tickets
-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = assigned_to);

-- Users can create their own tickets
CREATE POLICY "Users can create own tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own tickets (limited fields via functions)
CREATE POLICY "Users can update own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Support agents can view and update all tickets (would need role check)
-- CREATE POLICY "Support agents can manage all tickets" ON support_tickets
--   FOR ALL USING (
--     EXISTS (
--       SELECT 1 FROM user_profiles 
--       WHERE user_profiles.auth_user_id = auth.uid() 
--       AND user_profiles.role = 'support_agent'
--     )
--   );

-- RLS Policies for ticket_messages
-- Users can view messages in their tickets
CREATE POLICY "Users can view messages in own tickets" ON ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = ticket_messages.ticket_id 
      AND (support_tickets.user_id = auth.uid() OR support_tickets.assigned_to = auth.uid())
      AND ticket_messages.is_internal_note = FALSE
    )
  );

-- Users can create messages in their tickets
CREATE POLICY "Users can create messages in own tickets" ON ticket_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_tickets 
      WHERE support_tickets.id = ticket_messages.ticket_id 
      AND support_tickets.user_id = auth.uid()
    )
    AND sender_id = auth.uid()
    AND is_internal_note = FALSE
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ticket_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update last message timestamps
CREATE OR REPLACE FUNCTION update_ticket_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_user_message_at or last_agent_message_at based on sender
  IF NEW.sender_id = (SELECT user_id FROM support_tickets WHERE id = NEW.ticket_id) THEN
    UPDATE support_tickets 
    SET last_user_message_at = NOW(),
        updated_at = NOW()
    WHERE id = NEW.ticket_id;
  ELSE
    UPDATE support_tickets 
    SET last_agent_message_at = NOW(),
        updated_at = NOW()
    WHERE id = NEW.ticket_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_updated_at();

CREATE TRIGGER update_ticket_last_message
  AFTER INSERT ON ticket_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_last_message_at();

-- Helper function to get ticket statistics for a user
CREATE OR REPLACE FUNCTION get_user_ticket_stats(p_user_id UUID)
RETURNS TABLE (
  total_tickets INTEGER,
  open_tickets INTEGER,
  resolved_tickets INTEGER,
  avg_resolution_time INTERVAL,
  avg_satisfaction_rating NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_tickets,
    COUNT(*) FILTER (WHERE status IN ('open', 'in_progress', 'waiting_on_user'))::INTEGER as open_tickets,
    COUNT(*) FILTER (WHERE status IN ('resolved', 'closed'))::INTEGER as resolved_tickets,
    AVG(resolved_at - created_at) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_time,
    AVG(satisfaction_rating) as avg_satisfaction_rating
  FROM support_tickets
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get unread message count for a user
CREATE OR REPLACE FUNCTION get_unread_ticket_messages(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM ticket_messages tm
    JOIN support_tickets st ON st.id = tm.ticket_id
    WHERE st.user_id = p_user_id
    AND tm.sender_id != p_user_id
    AND tm.read_by_user = FALSE
    AND tm.is_internal_note = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sample data categories for reference
COMMENT ON TYPE ticket_category IS 'Categories for support tickets';
COMMENT ON COLUMN support_tickets.category IS 'Type of support request';
COMMENT ON COLUMN support_tickets.ticket_number IS 'Human-readable ticket number (auto-incremented)';
COMMENT ON COLUMN support_tickets.browser_info IS 'User agent string for debugging';
COMMENT ON COLUMN support_tickets.app_version IS 'App version when ticket was created';
COMMENT ON COLUMN support_tickets.page_url IS 'Page URL where user submitted ticket from';
COMMENT ON COLUMN ticket_messages.is_internal_note IS 'Internal notes visible only to support agents';
COMMENT ON COLUMN ticket_messages.attachments IS 'JSON array of attachment objects with url, filename, size, type';

-- Notification view for users to see their tickets with unread messages
CREATE OR REPLACE VIEW user_tickets_with_unread AS
SELECT 
  st.*,
  COUNT(tm.id) FILTER (WHERE tm.read_by_user = FALSE AND tm.sender_id != st.user_id) as unread_count,
  MAX(tm.created_at) as last_message_at
FROM support_tickets st
LEFT JOIN ticket_messages tm ON tm.ticket_id = st.id
WHERE st.status != 'closed'
GROUP BY st.id;