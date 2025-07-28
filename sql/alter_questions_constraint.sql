-- Alter the questions table to allow more than 4 questions per topic
-- The CSV data has topics with up to 8 questions

-- First, drop the existing check constraint
ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS questions_question_order_check;

-- Add a new constraint that allows up to 10 questions per topic
ALTER TABLE questions 
ADD CONSTRAINT questions_question_order_check 
CHECK (question_order >= 1 AND question_order <= 10);

-- Verify the constraint was updated
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'questions'::regclass
AND contype = 'c';