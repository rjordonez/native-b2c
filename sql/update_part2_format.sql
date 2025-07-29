-- Update Part 2 questions format to include "You should say:" before bullet points
-- This script updates all Part 2 topics to have the proper IELTS format

BEGIN;

-- Update all Part 2 topics to add "You should say:" if not already present
UPDATE topics 
SET questions = 
    CASE 
        WHEN questions LIKE '%You should say:%' THEN questions
        ELSE 
            -- Extract the main question (first line) and bullet points
            SPLIT_PART(questions, E'\n', 1) || E'\n\nYou should say:\n' || 
            SUBSTRING(questions FROM POSITION(E'\n' IN questions) + 1)
    END
WHERE part = 'part2';

-- Verify the update by showing a sample
SELECT 
    title,
    LEFT(questions, 200) || '...' as question_preview
FROM topics
WHERE part = 'part2'
LIMIT 5;

COMMIT;