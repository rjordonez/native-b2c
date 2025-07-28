-- Alter the topics and questions tables to allow part2
-- Currently they only allow part1 and part3

-- First, drop the existing check constraints
ALTER TABLE topics 
DROP CONSTRAINT IF EXISTS topics_part_check;

ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS questions_part_check;

-- Add new constraints that include part2
ALTER TABLE topics 
ADD CONSTRAINT topics_part_check 
CHECK (part IN ('part1', 'part2', 'part3'));

ALTER TABLE questions 
ADD CONSTRAINT questions_part_check 
CHECK (part IN ('part1', 'part2', 'part3'));

-- Also update the question_order constraint to allow more questions
ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS questions_question_order_check;

ALTER TABLE questions 
ADD CONSTRAINT questions_question_order_check 
CHECK (question_order >= 1 AND question_order <= 10);

-- Verify the constraints were updated
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid IN ('topics'::regclass, 'questions'::regclass)
AND contype = 'c'
ORDER BY conrelid::regclass::text, conname;