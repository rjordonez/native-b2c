-- Fix get_practice_activity to return all dates in range for calendar display
DROP FUNCTION IF EXISTS get_practice_activity(UUID, DATE, DATE);

CREATE OR REPLACE FUNCTION get_practice_activity(
    p_user_id UUID,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
)
RETURNS TABLE (
    practice_date DATE,
    tasks_completed INTEGER,
    total_tasks INTEGER
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    -- Set default date range if not provided (last 365 days)
    v_start_date := COALESCE(p_start_date, CURRENT_DATE - INTERVAL '365 days');
    v_end_date := COALESCE(p_end_date, CURRENT_DATE);
    
    RETURN QUERY
    WITH date_series AS (
        -- Generate all dates in the range
        SELECT generate_series(v_start_date, v_end_date, '1 day'::interval)::date AS date
    ),
    daily_progress AS (
        -- Get actual progress data
        SELECT 
            date,
            COUNT(CASE WHEN completed THEN 1 END)::INTEGER as completed_count,
            COUNT(*)::INTEGER as total_count
        FROM daily_checklist_progress
        WHERE user_id = p_user_id
        AND date >= v_start_date
        AND date <= v_end_date
        GROUP BY date
    )
    -- Join to get all dates with progress data where available
    SELECT 
        ds.date as practice_date,
        COALESCE(dp.completed_count, 0)::INTEGER as tasks_completed,
        COALESCE(dp.total_count, 0)::INTEGER as total_tasks
    FROM date_series ds
    LEFT JOIN daily_progress dp ON ds.date = dp.date
    ORDER BY ds.date ASC;  -- Changed to ASC for chronological order
END;
$$;

-- Add comment
COMMENT ON FUNCTION get_practice_activity(UUID, DATE, DATE) IS 'Get practice activity for a user within a date range, including all dates even without activity';