-- Update Part 2 questions format to include "You should say:" before bullet points
-- This script updates all Part 2 topics to have the proper IELTS format

BEGIN;

-- Create a function to properly format Part 2 questions
CREATE OR REPLACE FUNCTION format_part2_question(question_text TEXT) 
RETURNS TEXT AS $$
DECLARE
    lines TEXT[];
    main_question TEXT;
    bullet_points TEXT;
BEGIN
    -- Split the text into lines
    lines := string_to_array(question_text, E'\n');
    
    -- Get the main question (first line)
    main_question := lines[1];
    
    -- Get the bullet points (everything after first line)
    bullet_points := array_to_string(lines[2:array_length(lines, 1)], E'\n');
    
    -- Return formatted text
    RETURN main_question || E'\n\nYou should say:\n' || bullet_points;
END;
$$ LANGUAGE plpgsql;

-- Update all Part 2 topics to add "You should say:" if not already present
UPDATE topics 
SET questions = format_part2_question(questions)
WHERE part = 'part2'
AND questions NOT LIKE '%You should say:%';

-- Also update the questions table for Part 2 (they should only have the main question, not bullets)
UPDATE questions q
SET text = SPLIT_PART(t.questions, E'\n', 1)
FROM topics t
WHERE q.topic_id = t.id
AND t.part = 'part2';

-- Clean up the function
DROP FUNCTION IF EXISTS format_part2_question(TEXT);

-- Verify the update by showing samples
SELECT 
    title,
    questions
FROM topics
WHERE part = 'part2'
ORDER BY title
LIMIT 3;

COMMIT;