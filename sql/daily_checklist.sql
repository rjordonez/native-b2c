-- Daily Checklist Progress Table
-- Tracks user's daily practice checklist progress with automatic daily reset

-- Drop existing table first (this will cascade and drop the trigger)
DROP TABLE IF EXISTS daily_checklist_progress CASCADE;

-- Now drop the functions (after the table and trigger are gone)
DROP FUNCTION IF EXISTS get_or_create_daily_checklist(UUID);
DROP FUNCTION IF EXISTS complete_checklist_task(UUID, INTEGER);
DROP FUNCTION IF EXISTS get_checklist_progress(UUID);
DROP FUNCTION IF EXISTS cleanup_old_checklists();
DROP FUNCTION IF EXISTS update_daily_checklist_updated_at();

-- Create table for daily checklist progress
CREATE TABLE IF NOT EXISTS daily_checklist_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id INTEGER NOT NULL, -- 1 for Part 1, 2 for Part 2, 3 for Part 3
    task_name VARCHAR(255) NOT NULL, -- e.g., 'Practice Part 1'
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    date DATE DEFAULT CURRENT_DATE, -- Track which day this checklist is for
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id, date) -- One entry per task per user per day
);

-- Create indexes for performance
CREATE INDEX idx_daily_checklist_user_date ON daily_checklist_progress(user_id, date);
CREATE INDEX idx_daily_checklist_date ON daily_checklist_progress(date);

-- Enable Row Level Security
ALTER TABLE daily_checklist_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own checklist progress
CREATE POLICY "Users can view own checklist progress" ON daily_checklist_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own checklist progress
CREATE POLICY "Users can insert own checklist progress" ON daily_checklist_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own checklist progress
CREATE POLICY "Users can update own checklist progress" ON daily_checklist_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_daily_checklist_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_daily_checklist_updated_at_trigger
    BEFORE UPDATE ON daily_checklist_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_daily_checklist_updated_at();

-- Function to get or create today's checklist for a user
CREATE OR REPLACE FUNCTION get_or_create_daily_checklist(p_user_id UUID)
RETURNS TABLE (
    checklist_id UUID,
    checklist_user_id UUID,
    checklist_task_id INTEGER,
    checklist_task_name VARCHAR(255),
    checklist_completed BOOLEAN,
    checklist_completed_at TIMESTAMPTZ,
    checklist_date DATE
) AS $$
BEGIN
    -- Insert default tasks if they don't exist for today
    INSERT INTO daily_checklist_progress (user_id, task_id, task_name, date)
    VALUES 
        (p_user_id, 1, 'Practice Part 1', CURRENT_DATE),
        (p_user_id, 2, 'Practice Part 2', CURRENT_DATE),
        (p_user_id, 3, 'Practice Part 3', CURRENT_DATE)
    ON CONFLICT (user_id, task_id, date) DO NOTHING;
    
    -- Return today's checklist
    RETURN QUERY
    SELECT 
        dcp.id AS checklist_id,
        dcp.user_id AS checklist_user_id,
        dcp.task_id AS checklist_task_id,
        dcp.task_name AS checklist_task_name,
        dcp.completed AS checklist_completed,
        dcp.completed_at AS checklist_completed_at,
        dcp.date AS checklist_date
    FROM daily_checklist_progress dcp
    WHERE dcp.user_id = p_user_id
    AND dcp.date = CURRENT_DATE
    ORDER BY dcp.task_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark a task as completed
CREATE OR REPLACE FUNCTION complete_checklist_task(
    p_user_id UUID,
    p_task_id INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_updated BOOLEAN;
BEGIN
    UPDATE daily_checklist_progress
    SET 
        completed = TRUE,
        completed_at = CURRENT_TIMESTAMP
    WHERE user_id = p_user_id
    AND task_id = p_task_id
    AND date = CURRENT_DATE
    AND completed = FALSE;
    
    v_updated := FOUND;
    RETURN v_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get checklist progress summary
CREATE OR REPLACE FUNCTION get_checklist_progress(p_user_id UUID)
RETURNS TABLE (
    total_tasks INTEGER,
    completed_tasks INTEGER,
    progress_percentage INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_tasks,
        COUNT(CASE WHEN completed THEN 1 END)::INTEGER as completed_tasks,
        ROUND((COUNT(CASE WHEN completed THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100)::INTEGER as progress_percentage
    FROM daily_checklist_progress
    WHERE user_id = p_user_id
    AND date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Function to clean up old checklist data (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_checklists()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM daily_checklist_progress
    WHERE date < CURRENT_DATE - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count := ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE daily_checklist_progress IS 'Stores daily practice checklist progress for IELTS preparation with automatic daily reset';
COMMENT ON COLUMN daily_checklist_progress.task_id IS 'Task identifier: 1 for Part 1, 2 for Part 2, 3 for Part 3';
COMMENT ON COLUMN daily_checklist_progress.date IS 'The date this checklist entry is for, used for daily reset functionality';