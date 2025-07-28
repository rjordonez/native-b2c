-- Complete Topics Library Part 2 Import
-- Part 2 has a different structure - one main question per topic with cue cards (bullet points)
-- Total: 20 Part 2 topics from CSV

-- First run the constraint update if needed
-- ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_question_order_check;
-- ALTER TABLE questions ADD CONSTRAINT questions_question_order_check CHECK (question_order >= 1 AND question_order <= 10);

-- Insert all Part 2 topics
INSERT INTO topics (title, part, questions, estimated_time) VALUES
-- Describe a situation topics (10 topics)
('Describe a situation I', 'part2', 
 'Describe a situation when you helped someone in need.
• Who the person was
• How you helped them
• Why they needed help
• How you felt about helping', 
 '2-3 min'),

('Describe a situation II', 'part2', 
 'Describe a situation when you were late for an important event.
• What the event was
• Why you were late
• How others reacted
• How you felt in that situation', 
 '2-3 min'),

('Describe a situation III', 'part2', 
 'Describe a situation when you worked in a team.
• What the team was doing
• What your role was
• How you communicated
• Whether you enjoyed it or not', 
 '2-3 min'),

('Describe a situation IV', 'part2', 
 'Describe a situation when you solved a problem using your creativity.
• What the problem was
• How you solved it
• Why you chose that solution
• The outcome', 
 '2-3 min'),

('Describe a situation V', 'part2', 
 'Describe a situation when you had to make a difficult decision.
• What the decision was
• Why it was difficult
• What choices you had
• What you learned', 
 '2-3 min'),

('Describe a situation VI', 'part2', 
 'Describe a situation when you met someone for the first time and became friends quickly.
• Who the person was
• Where you met
• What you talked about
• Why you became friends quickly', 
 '2-3 min'),

('Describe a situation VII', 'part2', 
 'Describe a situation when you were surprised by good news.
• What the news was
• How you heard
• How you reacted
• Why it was surprising', 
 '2-3 min'),

('Describe a situation VIII', 'part2', 
 'Describe a situation when you had to wait for something for a long time.
• What you were waiting for
• How long you waited
• Why you had to wait
• How you felt', 
 '2-3 min'),

('Describe a situation IX', 'part2', 
 'Describe a situation when you gave advice to someone.
• Who the person was
• What advice you gave
• Why you gave it
• Whether they followed your advice', 
 '2-3 min'),

('Describe a situation X', 'part2', 
 'Describe a situation when you were proud of yourself.
• What happened
• Why it made you proud
• How others reacted
• How that situation changed you', 
 '2-3 min'),

-- Describe a person topics (10 topics)
('Describe a person I', 'part2', 
 'Describe a person who has inspired you.
• Who the person is
• How you know them
• What they have done
• Why they inspired you', 
 '2-3 min'),

('Describe a person II', 'part2', 
 'Describe a person you admire the most.
• Who the person is
• How you know them
• What makes them admirable
• Why you admire them', 
 '2-3 min'),

('Describe a person III', 'part2', 
 'Describe a person you enjoy spending time with.
• Who the person is
• How you know them
• What you do together
• Why you enjoy their company', 
 '2-3 min'),

('Describe a person IV', 'part2', 
 'Describe a person who is very good at their job.
• Who the person is
• What their job is
• Why they are good at it
• How you feel about them', 
 '2-3 min'),

('Describe a person V', 'part2', 
 'Describe a person who often helps others.
• Who the person is
• How they help others
• Why they do it
• How you feel about them', 
 '2-3 min'),

('Describe a person VI', 'part2', 
 'Describe a person who you think is very creative.
• Who the person is
• What makes them creative
• How they use creativity
• Why you think so', 
 '2-3 min'),

('Describe a person VII', 'part2', 
 'Describe a person you recently met and liked.
• Who the person is
• Where you met
• What you talked about
• Why you liked them', 
 '2-3 min'),

('Describe a person VIII', 'part2', 
 'Describe a person you would like to learn from.
• Who the person is
• What you want to learn
• Why you want to learn from them
• How they can help you', 
 '2-3 min'),

('Describe a person IX', 'part2', 
 'Describe a person you know who is very intelligent.
• Who the person is
• How you know them
• Why you think they are intelligent
• Examples of their intelligence', 
 '2-3 min'),

('Describe a person X', 'part2', 
 'Describe a person who is popular in your community.
• Who the person is
• Why they are popular
• What they do in the community
• How you feel about them', 
 '2-3 min');

-- For Part 2, insert a single question for each topic
-- The question text is the main prompt
INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
  t.id,
  SUBSTRING(t.questions FROM 1 FOR POSITION(E'\n' IN t.questions) - 1) as question_text,
  1,
  'part2'
FROM topics t
WHERE t.part = 'part2' 
AND t.title LIKE 'Describe a%'
AND t.created_at >= CURRENT_DATE;

-- Summary statistics
SELECT 
  'Part 2 Import Summary' as report,
  COUNT(DISTINCT t.id) as topics_added,
  COUNT(DISTINCT q.id) as questions_added
FROM topics t
LEFT JOIN questions q ON t.id = q.topic_id
WHERE t.part = 'part2' 
AND t.created_at >= CURRENT_DATE;

-- Detailed view
SELECT 
  t.title,
  t.part,
  LEFT(t.questions, 80) || '...' as question_preview
FROM topics t
WHERE t.part = 'part2' 
AND t.created_at >= CURRENT_DATE
ORDER BY t.title
LIMIT 5;