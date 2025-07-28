-- Practice Activity Functions
-- Functions to retrieve practice frequency data from daily_checklist_progress

-- Function to get practice activity for a date range
CREATE OR REPLACE FUNCTION get_practice_activity(
    p_user_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '365 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    practice_date DATE,
    tasks_completed INTEGER,
    total_tasks INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date as practice_date,
        COUNT(CASE WHEN completed THEN 1 END)::INTEGER as tasks_completed,
        COUNT(*)::INTEGER as total_tasks
    FROM daily_checklist_progress
    WHERE user_id = p_user_id
    AND date >= p_start_date
    AND date <= p_end_date
    GROUP BY date
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get practice streak
CREATE OR REPLACE FUNCTION get_practice_streak(p_user_id UUID)
RETURNS TABLE (
    current_streak INTEGER,
    longest_streak INTEGER,
    total_practice_days INTEGER,
    last_practice_date DATE
) AS $$
DECLARE
    v_current_streak INTEGER := 0;
    v_longest_streak INTEGER := 0;
    v_temp_streak INTEGER := 0;
    v_last_date DATE;
    v_prev_date DATE;
    v_total_days INTEGER := 0;
    v_last_practice DATE;
    r RECORD;
BEGIN
    -- Get all practice dates in order
    FOR r IN 
        SELECT DISTINCT date
        FROM daily_checklist_progress
        WHERE user_id = p_user_id
        AND completed = TRUE
        ORDER BY date DESC
    LOOP
        v_total_days := v_total_days + 1;
        
        -- Track last practice date
        IF v_last_practice IS NULL THEN
            v_last_practice := r.date;
        END IF;
        
        -- First date
        IF v_last_date IS NULL THEN
            v_temp_streak := 1;
            -- Check if it's today or yesterday for current streak
            IF r.date >= CURRENT_DATE - INTERVAL '1 day' THEN
                v_current_streak := 1;
            END IF;
        ELSE
            -- Check if consecutive
            IF v_last_date - r.date = 1 THEN
                v_temp_streak := v_temp_streak + 1;
                -- Update current streak if still active
                IF v_current_streak > 0 THEN
                    v_current_streak := v_temp_streak;
                END IF;
            ELSE
                -- Streak broken
                v_longest_streak := GREATEST(v_longest_streak, v_temp_streak);
                v_temp_streak := 1;
                -- Current streak is broken if not consecutive from today/yesterday
                IF v_current_streak > 0 THEN
                    v_current_streak := 0;
                END IF;
            END IF;
        END IF;
        
        v_last_date := r.date;
    END LOOP;
    
    -- Final check for longest streak
    v_longest_streak := GREATEST(v_longest_streak, v_temp_streak);
    
    RETURN QUERY
    SELECT 
        v_current_streak,
        v_longest_streak,
        v_total_days,
        v_last_practice;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get weekly practice summary
CREATE OR REPLACE FUNCTION get_weekly_practice_summary(
    p_user_id UUID,
    p_weeks_back INTEGER DEFAULT 12
)
RETURNS TABLE (
    week_start DATE,
    practice_days INTEGER,
    total_tasks_completed INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('week', date)::DATE as week_start,
        COUNT(DISTINCT date)::INTEGER as practice_days,
        COUNT(CASE WHEN completed THEN 1 END)::INTEGER as total_tasks_completed
    FROM daily_checklist_progress
    WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - (p_weeks_back * INTERVAL '1 week')
    AND completed = TRUE
    GROUP BY DATE_TRUNC('week', date)
    ORDER BY week_start DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get monthly practice heatmap data
CREATE OR REPLACE FUNCTION get_practice_heatmap(
    p_user_id UUID,
    p_months_back INTEGER DEFAULT 12
)
RETURNS TABLE (
    practice_date DATE,
    intensity INTEGER -- 0-4 scale based on tasks completed
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        date as practice_date,
        CASE 
            WHEN COUNT(CASE WHEN completed THEN 1 END) = 0 THEN 0
            WHEN COUNT(CASE WHEN completed THEN 1 END) = 1 THEN 1
            WHEN COUNT(CASE WHEN completed THEN 1 END) = 2 THEN 2
            WHEN COUNT(CASE WHEN completed THEN 1 END) >= 3 THEN 3
        END::INTEGER as intensity
    FROM daily_checklist_progress
    WHERE user_id = p_user_id
    AND date >= CURRENT_DATE - (p_months_back * INTERVAL '1 month')
    GROUP BY date
    ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments
COMMENT ON FUNCTION get_practice_activity IS 'Get practice activity data for a user within a date range';
COMMENT ON FUNCTION get_practice_streak IS 'Calculate current and longest practice streaks for a user';
COMMENT ON FUNCTION get_weekly_practice_summary IS 'Get weekly practice summary for the past N weeks';
COMMENT ON FUNCTION get_practice_heatmap IS 'Get practice intensity data for calendar heatmap visualization';