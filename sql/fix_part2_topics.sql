-- First, check what part values the Describe topics have
SELECT title, part 
FROM topics 
WHERE title LIKE 'Describe a%'
ORDER BY title;

-- If they were inserted as part3, update them to part2
-- But first we need to update the constraint
ALTER TABLE topics DROP CONSTRAINT IF EXISTS topics_part_check;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_part_check;

ALTER TABLE topics ADD CONSTRAINT topics_part_check CHECK (part IN ('part1', 'part2', 'part3'));
ALTER TABLE questions ADD CONSTRAINT questions_part_check CHECK (part IN ('part1', 'part2', 'part3'));

-- Now update any Describe topics that are incorrectly marked as part3
UPDATE topics 
SET part = 'part2'
WHERE title LIKE 'Describe a%' 
AND part = 'part3';

-- Also update their questions
UPDATE questions 
SET part = 'part2'
WHERE topic_id IN (
    SELECT id FROM topics WHERE title LIKE 'Describe a%' AND part = 'part2'
);

-- Verify the fix
SELECT 
    part,
    COUNT(*) as topic_count
FROM topics
WHERE title LIKE 'Describe a%'
GROUP BY part
ORDER BY part;