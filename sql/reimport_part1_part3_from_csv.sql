-- Complete Re-import of Part 1 and Part 3 Topics from CSV
-- This script will drop all existing Part 1 and Part 3 topics and questions, then re-import from CSV data

-- Start a transaction
BEGIN;

-- First, delete all questions for Part 1 and Part 3 topics
DELETE FROM questions 
WHERE topic_id IN (
    SELECT id FROM topics WHERE part IN ('part1', 'part3')
);

-- Then delete all Part 1 and Part 3 topics
DELETE FROM topics WHERE part IN ('part1', 'part3');

-- Insert Part 1 Topics with their questions grouped
-- We'll create topics first, then insert questions

-- Home / Accommodation (note: CSV has typo "Accomodation" but we'll fix it)
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Home / Accommodation', 'part1', 
'1. What kind of housing/accommodation do you live in?
2. Who do you live with?
3. How long have you lived there?
4. What''s the difference between where you are living now and where you have lived in the past?
5. Do you plan to live there for a long time?', 
'5-6 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What kind of housing/accommodation do you live in?', 1),
    ('Who do you live with?', 2),
    ('How long have you lived there?', 3),
    ('What''s the difference between where you are living now and where you have lived in the past?', 4),
    ('Do you plan to live there for a long time?', 5)
) AS q(text, question_order)
WHERE t.title = 'Home / Accommodation' AND t.part = 'part1';

-- Home / Accommodation II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Home / Accommodation II', 'part1', 
'1. Please describe the room you live in.
2. What part of your home do you like the most?
3. Which room does your family spend most of the time in?
4. Do you prefer living in a house or a flat?
5. Are the transport facilities to your home very good?', 
'5-6 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Please describe the room you live in.', 1),
    ('What part of your home do you like the most?', 2),
    ('Which room does your family spend most of the time in?', 3),
    ('Do you prefer living in a house or a flat?', 4),
    ('Are the transport facilities to your home very good?', 5)
) AS q(text, question_order)
WHERE t.title = 'Home / Accommodation II' AND t.part = 'part1';

-- Study II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Study II', 'part1', 
'1. What is your major or area of specialization?
2. Why did you choose to study that major?
3. Do you like your major? (Why?/Why not?)', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What is your major or area of specialization?', 1),
    ('Why did you choose to study that major?', 2),
    ('Do you like your major? (Why?/Why not?)', 3)
) AS q(text, question_order)
WHERE t.title = 'Study II' AND t.part = 'part1';

-- Study III
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Study III', 'part1', 
'1. What kind of school did you go to as a child?
2. What was your favourite subject as a child?
3. Do you think your country has an effective education system?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What kind of school did you go to as a child?', 1),
    ('What was your favourite subject as a child?', 2),
    ('Do you think your country has an effective education system?', 3)
) AS q(text, question_order)
WHERE t.title = 'Study III' AND t.part = 'part1';

-- Work II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Work II', 'part1', 
'1. What do you do?
2. What are your responsibilities?
3. Why did you choose to do that type of work (or, that job)?
4. Is there some other kind of work you would rather do?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What do you do?', 1),
    ('What are your responsibilities?', 2),
    ('Why did you choose to do that type of work (or, that job)?', 3),
    ('Is there some other kind of work you would rather do?', 4)
) AS q(text, question_order)
WHERE t.title = 'Work II' AND t.part = 'part1';

-- Work III
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Work III', 'part1', 
'1. Describe the company or organization you work for.
2. Do you enjoy your work?
3. What do you like about your job?
4. What do you dislike about your job?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Describe the company or organization you work for.', 1),
    ('Do you enjoy your work?', 2),
    ('What do you like about your job?', 3),
    ('What do you dislike about your job?', 4)
) AS q(text, question_order)
WHERE t.title = 'Work III' AND t.part = 'part1';

-- Number & Maths (note: CSV has "Number & Maths", not "Numbers & Maths")
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Number & Maths', 'part1', 
'1. Are you good at remembering numbers?
2. Do you often use numbers?
3. Is there any special number you like?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Are you good at remembering numbers?', 1),
    ('Do you often use numbers?', 2),
    ('Is there any special number you like?', 3)
) AS q(text, question_order)
WHERE t.title = 'Number & Maths' AND t.part = 'part1';

-- Free time & Weekend
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Free time & Weekend', 'part1', 
'1. What do you usually do on weekends?
2. Would you say weekends are important to us?
3. Do you often go to the cinema on weekends?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What do you usually do on weekends?', 1),
    ('Would you say weekends are important to us?', 2),
    ('Do you often go to the cinema on weekends?', 3)
) AS q(text, question_order)
WHERE t.title = 'Free time & Weekend' AND t.part = 'part1';

-- Spending time
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Spending time', 'part1', 
'1. Do you like to spend time by yourself or with your friends? Why?
2. When was the last time you spent time by yourself?
3. Do you want to spend more time by yourself?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like to spend time by yourself or with your friends? Why?', 1),
    ('When was the last time you spent time by yourself?', 2),
    ('Do you want to spend more time by yourself?', 3)
) AS q(text, question_order)
WHERE t.title = 'Spending time' AND t.part = 'part1';

-- Art
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Art', 'part1', 
'1. Do you like art?
2. Have you ever visited an art gallery?
3. Is there any art work on the wall in your room?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like art?', 1),
    ('Have you ever visited an art gallery?', 2),
    ('Is there any art work on the wall in your room?', 3)
) AS q(text, question_order)
WHERE t.title = 'Art' AND t.part = 'part1';

-- Pen & Pencil
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Pen & Pencil', 'part1', 
'1. When was the last time you bought a pen or pencil?
2. Do you usually use a pen or pencil?
3. What do you think if someone gives you a pen or a pencil as a gift?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('When was the last time you bought a pen or pencil?', 1),
    ('Do you usually use a pen or pencil?', 2),
    ('What do you think if someone gives you a pen or a pencil as a gift?', 3)
) AS q(text, question_order)
WHERE t.title = 'Pen & Pencil' AND t.part = 'part1';

-- Wild Animal
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Wild Animal', 'part1', 
'1. Do you like to watch TV programs about wild animals?
2. Where can you see wild animals?
3. In which country do you think you can see many wild animals?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like to watch TV programs about wild animals?', 1),
    ('Where can you see wild animals?', 2),
    ('In which country do you think you can see many wild animals?', 3)
) AS q(text, question_order)
WHERE t.title = 'Wild Animal' AND t.part = 'part1';

-- Pets II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Pets II', 'part1', 
'1. What is your favorite animal?
2. Have you ever kept an animal as a pet?
3. Where do you prefer to keep your pet, indoors or outdoors?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What is your favorite animal?', 1),
    ('Have you ever kept an animal as a pet?', 2),
    ('Where do you prefer to keep your pet, indoors or outdoors?', 3)
) AS q(text, question_order)
WHERE t.title = 'Pets II' AND t.part = 'part1';

-- Time & Planning
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Time & Planning', 'part1', 
'1. Do you make plans every day?
2. Are you good at managing your time?
3. What is the latest plan you made?
4. What is the hardest part about making plan?
5. How do you organize your time?
6. Do you think people organize time in the same way?', 
'6-7 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you make plans every day?', 1),
    ('Are you good at managing your time?', 2),
    ('What is the latest plan you made?', 3),
    ('What is the hardest part about making plan?', 4),
    ('How do you organize your time?', 5),
    ('Do you think people organize time in the same way?', 6)
) AS q(text, question_order)
WHERE t.title = 'Time & Planning' AND t.part = 'part1';

-- Languages II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Languages II', 'part1', 
'1. Will you learn other languages in the future?
2. Do you think it is difficult to learn a new language?
3. What language can you speak?
4. Why do you learn English?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Will you learn other languages in the future?', 1),
    ('Do you think it is difficult to learn a new language?', 2),
    ('What language can you speak?', 3),
    ('Why do you learn English?', 4)
) AS q(text, question_order)
WHERE t.title = 'Languages II' AND t.part = 'part1';

-- Perfume
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Perfume', 'part1', 
'1. Do you use perfume?
2. What kind of perfume do you like?
3. What does perfume mean to you?
4. Do you give perfume as a gift?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you use perfume?', 1),
    ('What kind of perfume do you like?', 2),
    ('What does perfume mean to you?', 3),
    ('Do you give perfume as a gift?', 4)
) AS q(text, question_order)
WHERE t.title = 'Perfume' AND t.part = 'part1';

-- Weather
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Weather', 'part1', 
'1. What kind of weather is typical in your hometown?
2. What''s your favorite season?
3. What kind of weather do you like most? Do you prefer dry or wet weather?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What kind of weather is typical in your hometown?', 1),
    ('What''s your favorite season?', 2),
    ('What kind of weather do you like most? Do you prefer dry or wet weather?', 3)
) AS q(text, question_order)
WHERE t.title = 'Weather' AND t.part = 'part1';

-- Routines II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Routines II', 'part1', 
'1. What is the busiest part of the day for you?
2. What part of your day do you like best?
3. Do you usually have the same routine everyday?
4. What is your daily routine?
5. Do you ever change your routine?', 
'5-6 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What is the busiest part of the day for you?', 1),
    ('What part of your day do you like best?', 2),
    ('Do you usually have the same routine everyday?', 3),
    ('What is your daily routine?', 4),
    ('Do you ever change your routine?', 5)
) AS q(text, question_order)
WHERE t.title = 'Routines II' AND t.part = 'part1';

-- Routines III
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Routines III', 'part1', 
'1. Do you think it is important to have a daily routine?
2. What would you like to change in your day to day routine?
3. Are all your days the same?
4. What time do you get up?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you think it is important to have a daily routine?', 1),
    ('What would you like to change in your day to day routine?', 2),
    ('Are all your days the same?', 3),
    ('What time do you get up?', 4)
) AS q(text, question_order)
WHERE t.title = 'Routines III' AND t.part = 'part1';

-- Meeting new people
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Meeting new people', 'part1', 
'1. How often do you meet new people? (Why/Why not?)
2. Do you find it easy to talk to new people? (Why/Why not?)
3. When you meet someone for the first time, do you know if you like them? (Why/Why not?)', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('How often do you meet new people? (Why/Why not?)', 1),
    ('Do you find it easy to talk to new people? (Why/Why not?)', 2),
    ('When you meet someone for the first time, do you know if you like them? (Why/Why not?)', 3)
) AS q(text, question_order)
WHERE t.title = 'Meeting new people' AND t.part = 'part1';

-- Flowers
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Flowers', 'part1', 
'1. Do Vietnamese people like to send flowers to others as gifts?
2. Have you ever sent flowers to people?
3. What kinds of flowers are popular in VietNam?
4. Are fake flowers popular in VietNam?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do Vietnamese people like to send flowers to others as gifts?', 1),
    ('Have you ever sent flowers to people?', 2),
    ('What kinds of flowers are popular in VietNam?', 3),
    ('Are fake flowers popular in VietNam?', 4)
) AS q(text, question_order)
WHERE t.title = 'Flowers' AND t.part = 'part1';

-- Evenings
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Evenings', 'part1', 
'1. Do you prefer studying in the morning or in the afternoon?
2. What do you usually do in the evening?
3. What did you do in the evening when you were little? Why?
4. Are there any differences between what you do in the evening now and what you did in the past?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you prefer studying in the morning or in the afternoon?', 1),
    ('What do you usually do in the evening?', 2),
    ('What did you do in the evening when you were little? Why?', 3),
    ('Are there any differences between what you do in the evening now and what you did in the past?', 4)
) AS q(text, question_order)
WHERE t.title = 'Evenings' AND t.part = 'part1';

-- Watches
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Watches', 'part1', 
'1. How often do you wear a watch?
2. What was your first watch like?
3. What kind of watches do you like to wear?
4. Do people still wear watches in your country?
5. Did you receive any watch as a gift when you were a child?', 
'5-6 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('How often do you wear a watch?', 1),
    ('What was your first watch like?', 2),
    ('What kind of watches do you like to wear?', 3),
    ('Do people still wear watches in your country?', 4),
    ('Did you receive any watch as a gift when you were a child?', 5)
) AS q(text, question_order)
WHERE t.title = 'Watches' AND t.part = 'part1';

-- Outdoor Activities
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Outdoor Activities', 'part1', 
'1. Do you like outdoor activities?
2. What outdoor activities do you (most) like to do?
3. What outdoor sports do you like? (Why?)
4. How much time do you spend outdoors every week?
5. Do Vietnamese people go out a lot?
6. What (types of) outdoor activities are popular in your country?
7. How and where do people in your country usually socialize?', 
'7-8 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like outdoor activities?', 1),
    ('What outdoor activities do you (most) like to do?', 2),
    ('What outdoor sports do you like? (Why?)', 3),
    ('How much time do you spend outdoors every week?', 4),
    ('Do Vietnamese people go out a lot?', 5),
    ('What (types of) outdoor activities are popular in your country?', 6),
    ('How and where do people in your country usually socialize?', 7)
) AS q(text, question_order)
WHERE t.title = 'Outdoor Activities' AND t.part = 'part1';

-- Neighbors
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Neighbors', 'part1', 
'1. Do you know your neighbors?
2. What do you think of your neighbors?
3. How do you get along well with your neighbors?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you know your neighbors?', 1),
    ('What do you think of your neighbors?', 2),
    ('How do you get along well with your neighbors?', 3)
) AS q(text, question_order)
WHERE t.title = 'Neighbors' AND t.part = 'part1';

-- Writing
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Writing', 'part1', 
'1. Do you often write things?
2. Do you prefer to write by hand or write using computer?
3. Do you think computers might one day replace handwriting?
4. When do children begin to write in your country?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you often write things?', 1),
    ('Do you prefer to write by hand or write using computer?', 2),
    ('Do you think computers might one day replace handwriting?', 3),
    ('When do children begin to write in your country?', 4)
) AS q(text, question_order)
WHERE t.title = 'Writing' AND t.part = 'part1';

-- Jewellery
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Jewellery', 'part1', 
'1. Do you often wear jewellery?
2. What type of jewellery do you like?
3. Have you ever given jewellery to someone as a gift?
4. Why do you think some people wear a piece of jewellery for a long time?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you often wear jewellery?', 1),
    ('What type of jewellery do you like?', 2),
    ('Have you ever given jewellery to someone as a gift?', 3),
    ('Why do you think some people wear a piece of jewellery for a long time?', 4)
) AS q(text, question_order)
WHERE t.title = 'Jewellery' AND t.part = 'part1';

-- Birthdays
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Birthdays', 'part1', 
'1. How do children celebrate birthdays in your country?
2. How did you celebrate your last birthday?
3. What kinds of birthday gifts do you like to receive?
4. Is there a difference between the way you celebrate your birthday in the past and in the present?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('How do children celebrate birthdays in your country?', 1),
    ('How did you celebrate your last birthday?', 2),
    ('What kinds of birthday gifts do you like to receive?', 3),
    ('Is there a difference between the way you celebrate your birthday in the past and in the present?', 4)
) AS q(text, question_order)
WHERE t.title = 'Birthdays' AND t.part = 'part1';

-- Happy
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Happy', 'part1', 
'1. Is there anything that has made you feel happy lately?
2. What made you happy when you were little?
3. What hobbies or activities make you feel happy now?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Is there anything that has made you feel happy lately?', 1),
    ('What made you happy when you were little?', 2),
    ('What hobbies or activities make you feel happy now?', 3)
) AS q(text, question_order)
WHERE t.title = 'Happy' AND t.part = 'part1';

-- Staying up late
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Staying up late', 'part1', 
'1. Do you often stay up late at night? (Why/Why not?)
2. Did you stay up late more often when you were younger? (Why/Why not?)
3. What do you generally do when you stay up late? (Why/Why not?)', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you often stay up late at night? (Why/Why not?)', 1),
    ('Did you stay up late more often when you were younger? (Why/Why not?)', 2),
    ('What do you generally do when you stay up late? (Why/Why not?)', 3)
) AS q(text, question_order)
WHERE t.title = 'Staying up late' AND t.part = 'part1';

-- Internet I
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Internet I', 'part1', 
'1. Do you use the Internet?
2. How often do you use the Internet?
3. How (or, where) do you go onto the Internet?
4. Have you ever bought anything on the Internet?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you use the Internet?', 1),
    ('How often do you use the Internet?', 2),
    ('How (or, where) do you go onto the Internet?', 3),
    ('Have you ever bought anything on the Internet?', 4)
) AS q(text, question_order)
WHERE t.title = 'Internet I' AND t.part = 'part1';

-- Internet II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Internet II', 'part1', 
'1. Is the Internet very important (or, useful) to you?
2. When was the first time you used the Internet?
3. How did you learn to use the Internet?
4. Do you think the Internet is a good thing?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Is the Internet very important (or, useful) to you?', 1),
    ('When was the first time you used the Internet?', 2),
    ('How did you learn to use the Internet?', 3),
    ('Do you think the Internet is a good thing?', 4)
) AS q(text, question_order)
WHERE t.title = 'Internet II' AND t.part = 'part1';

-- School
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('School', 'part1', 
'1. Where do you go to school?
2. Do you think your school is good for every student?
3. What changes do you want to make in your school?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Where do you go to school?', 1),
    ('Do you think your school is good for every student?', 2),
    ('What changes do you want to make in your school?', 3)
) AS q(text, question_order)
WHERE t.title = 'School' AND t.part = 'part1';

-- Music I
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Music I', 'part1', 
'1. Do you like listening to music?
2. When do you listen to music?
3. Did you learn instruments?
4. Did you have any music classes in school?
5. Do you think it is necessary for children to have music classes?', 
'5-6 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like listening to music?', 1),
    ('When do you listen to music?', 2),
    ('Did you learn instruments?', 3),
    ('Did you have any music classes in school?', 4),
    ('Do you think it is necessary for children to have music classes?', 5)
) AS q(text, question_order)
WHERE t.title = 'Music I' AND t.part = 'part1';

-- Music II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Music II', 'part1', 
'1. What do you think of Vietnamese traditional music?
2. How much time do you spend listening to music every day?
3. What is your favorite kind of music?
4. When did you start listening to this type of music?
5. How do you feel when you listening to music?', 
'5-6 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What do you think of Vietnamese traditional music?', 1),
    ('How much time do you spend listening to music every day?', 2),
    ('What is your favorite kind of music?', 3),
    ('When did you start listening to this type of music?', 4),
    ('How do you feel when you listening to music?', 5)
) AS q(text, question_order)
WHERE t.title = 'Music II' AND t.part = 'part1';

-- Shopping (Part 1)
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Shopping', 'part1', 
'1. Do you like going shopping?
2. Do you shop online?
3. Does shopping take you a lot of time?
4. What is the best part about shopping?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like going shopping?', 1),
    ('Do you shop online?', 2),
    ('Does shopping take you a lot of time?', 3),
    ('What is the best part about shopping?', 4)
) AS q(text, question_order)
WHERE t.title = 'Shopping' AND t.part = 'part1';

-- Law
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Law', 'part1', 
'1. Do you think law and order are important?
2. Which department is most responsible for enforcing the law?
3. Is there any law you think is too strict? (Why?/Why not?)', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you think law and order are important?', 1),
    ('Which department is most responsible for enforcing the law?', 2),
    ('Is there any law you think is too strict? (Why?/Why not?)', 3)
) AS q(text, question_order)
WHERE t.title = 'Law' AND t.part = 'part1';

-- Relax
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Relax', 'part1', 
'1. What would you do to relax?
2. Do you think doing sports is a good way to relax?
3. Do you think a vacation is a good time for you to relax?
4. Do you think students need more time for relaxing?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What would you do to relax?', 1),
    ('Do you think doing sports is a good way to relax?', 2),
    ('Do you think a vacation is a good time for you to relax?', 3),
    ('Do you think students need more time for relaxing?', 4)
) AS q(text, question_order)
WHERE t.title = 'Relax' AND t.part = 'part1';

-- Sports II
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Sports II', 'part1', 
'1. What sports do you like? (why?)
2. What sports are most popular in Vietnam?
3. Are boys and girls good at the same sports?
4. What sports do children prefer?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What sports do you like? (why?)', 1),
    ('What sports are most popular in Vietnam?', 2),
    ('Are boys and girls good at the same sports?', 3),
    ('What sports do children prefer?', 4)
) AS q(text, question_order)
WHERE t.title = 'Sports II' AND t.part = 'part1';

-- Exercise
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Exercise', 'part1', 
'1. Do you like to do daily exercise? (why?/why not?)
2. What are the advantages of doing regular exercise?
3. Where do people in Vietnam usually exercise?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like to do daily exercise? (why?/why not?)', 1),
    ('What are the advantages of doing regular exercise?', 2),
    ('Where do people in Vietnam usually exercise?', 3)
) AS q(text, question_order)
WHERE t.title = 'Exercise' AND t.part = 'part1';

-- Cinema
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Cinema', 'part1', 
'1. What type of movies do you like?
2. Do you often go to the cinema?
3. Do you like watching movies in the cinema or at home?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What type of movies do you like?', 1),
    ('Do you often go to the cinema?', 2),
    ('Do you like watching movies in the cinema or at home?', 3)
) AS q(text, question_order)
WHERE t.title = 'Cinema' AND t.part = 'part1';

-- Swimming
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Swimming', 'part1', 
'1. Do you like swimming?
2. Where do (or can) people go swimming in your hometown (or, near your home)?
3. Is swimming very popular in your country?
4. Why do many people like swimming?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like swimming?', 1),
    ('Where do (or can) people go swimming in your hometown (or, near your home)?', 2),
    ('Is swimming very popular in your country?', 3),
    ('Why do many people like swimming?', 4)
) AS q(text, question_order)
WHERE t.title = 'Swimming' AND t.part = 'part1';

-- Asking for help
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Asking for help', 'part1', 
'1. Do you ask for help when you have a problem?
2. Why are teachers always willing to help students?
3. What kinds of help do you often ask for?
4. When was the last time you asked for help?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you ask for help when you have a problem?', 1),
    ('Why are teachers always willing to help students?', 2),
    ('What kinds of help do you often ask for?', 3),
    ('When was the last time you asked for help?', 4)
) AS q(text, question_order)
WHERE t.title = 'Asking for help' AND t.part = 'part1';

-- Childhood Memory
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Childhood Memory', 'part1', 
'1. What did you enjoy doing as a child?
2. Did you enjoy your childhood?
3. What are your best childhood memories?
4. Do you think it is better for children to grow up in the city or in the countryside?', 
'5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What did you enjoy doing as a child?', 1),
    ('Did you enjoy your childhood?', 2),
    ('What are your best childhood memories?', 3),
    ('Do you think it is better for children to grow up in the city or in the countryside?', 4)
) AS q(text, question_order)
WHERE t.title = 'Childhood Memory' AND t.part = 'part1';

-- Transportation (Part 1)
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Transportation', 'part1', 
'1. What''s the most popular means of transportation in your hometown?
2. How often do you take buses?
3. Can you compare the advantages of planes and trains?
4. Is driving to work popular in your country?
5. Do you think people will drive more in the future?
6. Would you ride bikes to work in the future?
7. What will become the most popular means of transportation in Vietnam?
8. Do you prefer public transportation or private transportation?', 
'8-9 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What''s the most popular means of transportation in your hometown?', 1),
    ('How often do you take buses?', 2),
    ('Can you compare the advantages of planes and trains?', 3),
    ('Is driving to work popular in your country?', 4),
    ('Do you think people will drive more in the future?', 5),
    ('Would you ride bikes to work in the future?', 6),
    ('What will become the most popular means of transportation in Vietnam?', 7),
    ('Do you prefer public transportation or private transportation?', 8)
) AS q(text, question_order)
WHERE t.title = 'Transportation' AND t.part = 'part1';

-- Now Part 3 Topics
-- Shopping (Part 3)
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Shopping', 'part3', 
'1. What are the differences between shopping in a shopping mall and in a street market?
2. Which is more commonly visited in VietNam, shopping malls or street markets?
3. Is advertising important?', 
'4-5 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What are the differences between shopping in a shopping mall and in a street market?', 1),
    ('Which is more commonly visited in VietNam, shopping malls or street markets?', 2),
    ('Is advertising important?', 3)
) AS q(text, question_order)
WHERE t.title = 'Shopping' AND t.part = 'part3';

-- Transportation (Part 3)
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Transportation', 'part3', 
'1. What are the advantages and disadvantages of public and private transportation?
2. What are the advantages to society of having more people using mass transportation?
3. Compare the advantages and disadvantages of using mass transportation.
4. Why do some people have to travel a long distance every day to go to work?
5. What are the advantages and disadvantages of living in the centre of a city and living in the suburbs of a city?', 
'6-7 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What are the advantages and disadvantages of public and private transportation?', 1),
    ('What are the advantages to society of having more people using mass transportation?', 2),
    ('Compare the advantages and disadvantages of using mass transportation.', 3),
    ('Why do some people have to travel a long distance every day to go to work?', 4),
    ('What are the advantages and disadvantages of living in the centre of a city and living in the suburbs of a city?', 5)
) AS q(text, question_order)
WHERE t.title = 'Transportation' AND t.part = 'part3';

-- Routines (Part 3)
INSERT INTO topics (title, part, questions, estimated_time) VALUES
('Routines', 'part3', 
'1. Should children have learning routines?
2. What are the advantages of children having a routine at school?
3. Does having a routine make kids feel more secure at school?
4. How do people''s routines differ on weekdays and weekends?
5. What daily routines do people have at home?
6. What are the differences between people''s daily routines now and in the last 15 years?', 
'7-8 min');

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Should children have learning routines?', 1),
    ('What are the advantages of children having a routine at school?', 2),
    ('Does having a routine make kids feel more secure at school?', 3),
    ('How do people''s routines differ on weekdays and weekends?', 4),
    ('What daily routines do people have at home?', 5),
    ('What are the differences between people''s daily routines now and in the last 15 years?', 6)
) AS q(text, question_order)
WHERE t.title = 'Routines' AND t.part = 'part3';

-- Commit the transaction
COMMIT;

-- Verify the import
SELECT 
    t.part,
    COUNT(DISTINCT t.id) as total_topics,
    COUNT(DISTINCT q.id) as total_questions,
    COUNT(DISTINCT CASE WHEN q.id IS NULL THEN t.id END) as topics_without_questions
FROM topics t
LEFT JOIN questions q ON t.id = q.topic_id
WHERE t.part IN ('part1', 'part3')
GROUP BY t.part
ORDER BY t.part;

-- Show some specific topics including Evenings to verify
SELECT 
    t.title,
    t.part,
    COUNT(q.id) as question_count,
    ARRAY_AGG(q.text ORDER BY q.question_order) as questions
FROM topics t
LEFT JOIN questions q ON t.id = q.topic_id
WHERE t.title IN ('Evenings', 'Shopping', 'Transportation', 'Routines')
GROUP BY t.id, t.title, t.part
ORDER BY t.part, t.title;