-- Check how Part 2 topics are structured
SELECT 
    t.id,
    t.title,
    t.part,
    LEFT(t.questions, 100) || '...' as questions_preview,
    COUNT(q.id) as question_count
FROM topics t
LEFT JOIN questions q ON t.id = q.topic_id
WHERE t.part = 'part2'
GROUP BY t.id, t.title, t.part, t.questions
LIMIT 5;

-- Check specific Part 2 questions
SELECT 
    q.id,
    q.text,
    q.question_order,
    t.title as topic_title
FROM questions q
JOIN topics t ON q.topic_id = t.id
WHERE t.part = 'part2'
LIMIT 5;