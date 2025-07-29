-- Add NEW Part 1 and Part 3 Topics from Additional CSV
-- This script adds only NEW topics that don't already exist in the database
-- Uses NOT EXISTS checks instead of ON CONFLICT

-- Start a transaction
BEGIN;

-- Part 1 Topics - NEW topics only

-- Hometown (NEW - different from existing Home/Accommodation)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Hometown',
    'part1', 
    '1. Where do you usually go when you want to relax in your hometown?
2. What do you like most about your hometown?
3. Has your hometown changed much in recent years?
4. Would you like to live in your hometown in the future?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Hometown' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Where do you usually go when you want to relax in your hometown?', 1),
    ('What do you like most about your hometown?', 2),
    ('Has your hometown changed much in recent years?', 3),
    ('Would you like to live in your hometown in the future?', 4)
) AS q(text, question_order)
WHERE t.title = 'Hometown' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Work or Studies (NEW - combined topic)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Work or Studies',
    'part1', 
    '1. What do you enjoy most about your work or studies?
2. Why did you choose your current field of study or job?
3. Do you prefer working alone or in a team?
4. What is the most challenging part of your studies or work?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Work or Studies' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What do you enjoy most about your work or studies?', 1),
    ('Why did you choose your current field of study or job?', 2),
    ('Do you prefer working alone or in a team?', 3),
    ('What is the most challenging part of your studies or work?', 4)
) AS q(text, question_order)
WHERE t.title = 'Work or Studies' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Daily Routine (NEW - different from existing Routines)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Daily Routine',
    'part1', 
    '1. How do you usually spend your mornings?
2. What is your favorite part of the day?
3. Do you prefer having a fixed routine or a flexible one?
4. Has your daily routine changed recently?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Daily Routine' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('How do you usually spend your mornings?', 1),
    ('What is your favorite part of the day?', 2),
    ('Do you prefer having a fixed routine or a flexible one?', 3),
    ('Has your daily routine changed recently?', 4)
) AS q(text, question_order)
WHERE t.title = 'Daily Routine' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Reading (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Reading',
    'part1', 
    '1. Do you prefer reading e-books or printed books? Why?
2. How often do you read for pleasure?
3. What kind of books do you like reading?
4. Do you think reading is important for learning?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Reading' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you prefer reading e-books or printed books? Why?', 1),
    ('How often do you read for pleasure?', 2),
    ('What kind of books do you like reading?', 3),
    ('Do you think reading is important for learning?', 4)
) AS q(text, question_order)
WHERE t.title = 'Reading' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Music (check if exists, update questions if needed)
-- First check if Music exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM topics WHERE title = 'Music' AND part = 'part1') THEN
        -- Delete existing questions
        DELETE FROM questions 
        WHERE topic_id IN (SELECT id FROM topics WHERE title = 'Music' AND part = 'part1');
        
        -- Update the topic questions text
        UPDATE topics 
        SET questions = '1. What type of music do you usually listen to?
2. Do you like listening to music while studying or working?
3. Have your music preferences changed over time?
4. Do you prefer live concerts or listening to recorded music?'
        WHERE title = 'Music' AND part = 'part1';
    ELSE
        -- Insert new topic
        INSERT INTO topics (title, part, questions, estimated_time)
        VALUES ('Music', 'part1', 
        '1. What type of music do you usually listen to?
2. Do you like listening to music while studying or working?
3. Have your music preferences changed over time?
4. Do you prefer live concerts or listening to recorded music?', 
        '5 min');
    END IF;
END $$;

-- Insert Music questions
INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What type of music do you usually listen to?', 1),
    ('Do you like listening to music while studying or working?', 2),
    ('Have your music preferences changed over time?', 3),
    ('Do you prefer live concerts or listening to recorded music?', 4)
) AS q(text, question_order)
WHERE t.title = 'Music' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Social Media (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Social Media',
    'part1', 
    '1. How often do you post on social media?
2. Do you think social media is a good way to stay in touch with friends?
3. What do you usually post on social media?
4. Have you ever taken a break from social media?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Social Media' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('How often do you post on social media?', 1),
    ('Do you think social media is a good way to stay in touch with friends?', 2),
    ('What do you usually post on social media?', 3),
    ('Have you ever taken a break from social media?', 4)
) AS q(text, question_order)
WHERE t.title = 'Social Media' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Weather (update existing)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM topics WHERE title = 'Weather' AND part = 'part1') THEN
        -- Delete existing questions
        DELETE FROM questions 
        WHERE topic_id IN (SELECT id FROM topics WHERE title = 'Weather' AND part = 'part1');
        
        -- Update the topic questions text
        UPDATE topics 
        SET questions = '1. What is your favorite season of the year? Why?
2. Do you prefer hot weather or cold weather?
3. How does the weather affect your mood?
4. Have you ever experienced extreme weather conditions?'
        WHERE title = 'Weather' AND part = 'part1';
    ELSE
        -- Insert new topic
        INSERT INTO topics (title, part, questions, estimated_time)
        VALUES ('Weather', 'part1', 
        '1. What is your favorite season of the year? Why?
2. Do you prefer hot weather or cold weather?
3. How does the weather affect your mood?
4. Have you ever experienced extreme weather conditions?', 
        '5 min');
    END IF;
END $$;

-- Insert Weather questions
INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What is your favorite season of the year? Why?', 1),
    ('Do you prefer hot weather or cold weather?', 2),
    ('How does the weather affect your mood?', 3),
    ('Have you ever experienced extreme weather conditions?', 4)
) AS q(text, question_order)
WHERE t.title = 'Weather' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Food (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Food',
    'part1', 
    '1. Do you like trying new kinds of food?
2. What is your favorite type of cuisine?
3. How often do you eat out at restaurants?
4. Do you prefer cooking at home or eating out?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Food' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you like trying new kinds of food?', 1),
    ('What is your favorite type of cuisine?', 2),
    ('How often do you eat out at restaurants?', 3),
    ('Do you prefer cooking at home or eating out?', 4)
) AS q(text, question_order)
WHERE t.title = 'Food' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Sports (create new or update)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM topics WHERE title = 'Sports' AND part = 'part1') THEN
        -- Delete existing questions
        DELETE FROM questions 
        WHERE topic_id IN (SELECT id FROM topics WHERE title = 'Sports' AND part = 'part1');
        
        -- Update the topic questions text
        UPDATE topics 
        SET questions = '1. What sport do you enjoy watching or playing the most?
2. Did you play any sports when you were a child?
3. Do you prefer team sports or individual sports?
4. How often do you exercise or play sports now?'
        WHERE title = 'Sports' AND part = 'part1';
    ELSE
        -- Insert new topic
        INSERT INTO topics (title, part, questions, estimated_time)
        VALUES ('Sports', 'part1', 
        '1. What sport do you enjoy watching or playing the most?
2. Did you play any sports when you were a child?
3. Do you prefer team sports or individual sports?
4. How often do you exercise or play sports now?', 
        '5 min');
    END IF;
END $$;

-- Insert Sports questions
INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What sport do you enjoy watching or playing the most?', 1),
    ('Did you play any sports when you were a child?', 2),
    ('Do you prefer team sports or individual sports?', 3),
    ('How often do you exercise or play sports now?', 4)
) AS q(text, question_order)
WHERE t.title = 'Sports' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Technology (NEW for Part 1)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Technology',
    'part1', 
    '1. What technology do you use the most in your daily life?
2. Do you prefer using a laptop or a smartphone?
3. Has technology changed the way you communicate?
4. What is a piece of technology you cannot live without?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Technology' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('What technology do you use the most in your daily life?', 1),
    ('Do you prefer using a laptop or a smartphone?', 2),
    ('Has technology changed the way you communicate?', 3),
    ('What is a piece of technology you cannot live without?', 4)
) AS q(text, question_order)
WHERE t.title = 'Technology' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Travel (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Travel',
    'part1', 
    '1. Do you prefer traveling alone or with friends?
2. What is your favorite type of holiday?
3. Do you like visiting new places or going back to familiar ones?
4. What was your most memorable trip?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Travel' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you prefer traveling alone or with friends?', 1),
    ('What is your favorite type of holiday?', 2),
    ('Do you like visiting new places or going back to familiar ones?', 3),
    ('What was your most memorable trip?', 4)
) AS q(text, question_order)
WHERE t.title = 'Travel' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Shopping (update existing)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM topics WHERE title = 'Shopping' AND part = 'part1') THEN
        -- Delete existing questions
        DELETE FROM questions 
        WHERE topic_id IN (SELECT id FROM topics WHERE title = 'Shopping' AND part = 'part1');
        
        -- Update the topic questions text
        UPDATE topics 
        SET questions = '1. Do you enjoy shopping in malls or online?
2. What was the last thing you bought?
3. Do you prefer buying branded items or not?
4. Do you like shopping with friends or alone?'
        WHERE title = 'Shopping' AND part = 'part1';
    END IF;
END $$;

-- Insert Shopping questions
INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you enjoy shopping in malls or online?', 1),
    ('What was the last thing you bought?', 2),
    ('Do you prefer buying branded items or not?', 3),
    ('Do you like shopping with friends or alone?', 4)
) AS q(text, question_order)
WHERE t.title = 'Shopping' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Television & Streaming (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Television & Streaming',
    'part1', 
    '1. Do you often watch TV series or movies?
2. Do you prefer watching movies at home or in the cinema?
3. What is your favorite TV show?
4. Do you think people watch too much TV nowadays?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Television & Streaming' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you often watch TV series or movies?', 1),
    ('Do you prefer watching movies at home or in the cinema?', 2),
    ('What is your favorite TV show?', 3),
    ('Do you think people watch too much TV nowadays?', 4)
) AS q(text, question_order)
WHERE t.title = 'Television & Streaming' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Pets (create or update)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM topics WHERE title = 'Pets' AND part = 'part1') THEN
        -- Delete existing questions
        DELETE FROM questions 
        WHERE topic_id IN (SELECT id FROM topics WHERE title = 'Pets' AND part = 'part1');
        
        -- Update the topic questions text
        UPDATE topics 
        SET questions = '1. Would you like to have a pet in the future?
2. Did you have a pet when you were a child?
3. What animals do you like the most?
4. Do you think pets make people happier?'
        WHERE title = 'Pets' AND part = 'part1';
    ELSE
        -- Insert new topic
        INSERT INTO topics (title, part, questions, estimated_time)
        VALUES ('Pets', 'part1', 
        '1. Would you like to have a pet in the future?
2. Did you have a pet when you were a child?
3. What animals do you like the most?
4. Do you think pets make people happier?', 
        '5 min');
    END IF;
END $$;

-- Insert Pets questions
INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('Would you like to have a pet in the future?', 1),
    ('Did you have a pet when you were a child?', 2),
    ('What animals do you like the most?', 3),
    ('Do you think pets make people happier?', 4)
) AS q(text, question_order)
WHERE t.title = 'Pets' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Sleep (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Sleep',
    'part1', 
    '1. How many hours do you usually sleep every night?
2. Do you take naps during the day?
3. What do you do if you cannot fall asleep?
4. Has your sleeping pattern changed recently?', 
    '5 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Sleep' AND part = 'part1'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part1'
FROM topics t
CROSS JOIN (VALUES 
    ('How many hours do you usually sleep every night?', 1),
    ('Do you take naps during the day?', 2),
    ('What do you do if you cannot fall asleep?', 3),
    ('Has your sleeping pattern changed recently?', 4)
) AS q(text, question_order)
WHERE t.title = 'Sleep' AND t.part = 'part1'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Part 3 Topics - NEW topics only

-- Education (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Education',
    'part3', 
    '1. How has education changed in your country over the years?
2. Should education be free for everyone?
3. Do you think exams are the best way to assess students?
4. How important is practical knowledge compared to theoretical knowledge?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Education' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('How has education changed in your country over the years?', 1),
    ('Should education be free for everyone?', 2),
    ('Do you think exams are the best way to assess students?', 3),
    ('How important is practical knowledge compared to theoretical knowledge?', 4)
) AS q(text, question_order)
WHERE t.title = 'Education' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Technology (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Technology',
    'part3', 
    '1. How has technology changed the way people interact?
2. Do you think people rely too much on technology today?
3. What are the pros and cons of using technology in education?
4. How do you see technology evolving in the next decade?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Technology' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('How has technology changed the way people interact?', 1),
    ('Do you think people rely too much on technology today?', 2),
    ('What are the pros and cons of using technology in education?', 3),
    ('How do you see technology evolving in the next decade?', 4)
) AS q(text, question_order)
WHERE t.title = 'Technology' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Environment (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Environment',
    'part3', 
    '1. What are the biggest environmental problems in your country?
2. Who should take more responsibility for protecting the environment: individuals or governments?
3. How effective are international agreements on climate change?
4. What can be done to encourage people to recycle more?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Environment' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What are the biggest environmental problems in your country?', 1),
    ('Who should take more responsibility for protecting the environment: individuals or governments?', 2),
    ('How effective are international agreements on climate change?', 3),
    ('What can be done to encourage people to recycle more?', 4)
) AS q(text, question_order)
WHERE t.title = 'Environment' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Health (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Health',
    'part3', 
    '1. Do you think people today are healthier than in the past?
2. Should governments spend more on healthcare than on the military?
3. How can people be encouraged to live healthier lives?
4. What role does mental health play in overall well-being?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Health' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you think people today are healthier than in the past?', 1),
    ('Should governments spend more on healthcare than on the military?', 2),
    ('How can people be encouraged to live healthier lives?', 3),
    ('What role does mental health play in overall well-being?', 4)
) AS q(text, question_order)
WHERE t.title = 'Health' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Globalization (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Globalization',
    'part3', 
    '1. How has globalization affected your country?
2. Do you think globalization is good for local cultures?
3. What are the benefits and drawbacks of globalization?
4. How has globalization changed the job market?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Globalization' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('How has globalization affected your country?', 1),
    ('Do you think globalization is good for local cultures?', 2),
    ('What are the benefits and drawbacks of globalization?', 3),
    ('How has globalization changed the job market?', 4)
) AS q(text, question_order)
WHERE t.title = 'Globalization' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Media (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Media',
    'part3', 
    '1. Do you think the media influences public opinion?
2. How has social media changed news reporting?
3. Should the government regulate media content?
4. Do people trust the news nowadays? Why or why not?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Media' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you think the media influences public opinion?', 1),
    ('How has social media changed news reporting?', 2),
    ('Should the government regulate media content?', 3),
    ('Do people trust the news nowadays? Why or why not?', 4)
) AS q(text, question_order)
WHERE t.title = 'Media' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Culture (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Culture',
    'part3', 
    '1. Why is it important to preserve traditional culture?
2. How do cultural values influence people''s behavior?
3. Should governments invest in preserving heritage sites?
4. How has modernization affected cultural traditions?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Culture' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Why is it important to preserve traditional culture?', 1),
    ('How do cultural values influence people''s behavior?', 2),
    ('Should governments invest in preserving heritage sites?', 3),
    ('How has modernization affected cultural traditions?', 4)
) AS q(text, question_order)
WHERE t.title = 'Culture' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Crime (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Crime',
    'part3', 
    '1. What are the main causes of crime in society?
2. Do you think severe punishment reduces crime?
3. How effective are community programs in preventing crime?
4. Should the death penalty still be used?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Crime' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What are the main causes of crime in society?', 1),
    ('Do you think severe punishment reduces crime?', 2),
    ('How effective are community programs in preventing crime?', 3),
    ('Should the death penalty still be used?', 4)
) AS q(text, question_order)
WHERE t.title = 'Crime' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Work (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Work',
    'part3', 
    '1. How has remote work changed people''s lives?
2. Do you think job satisfaction is more important than salary?
3. What are the challenges of working in large companies?
4. How will automation impact future employment?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Work' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('How has remote work changed people''s lives?', 1),
    ('Do you think job satisfaction is more important than salary?', 2),
    ('What are the challenges of working in large companies?', 3),
    ('How will automation impact future employment?', 4)
) AS q(text, question_order)
WHERE t.title = 'Work' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Travel (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Travel',
    'part3', 
    '1. Why do people like to travel abroad?
2. What are the disadvantages of mass tourism?
3. Should governments promote domestic tourism?
4. How has air travel changed tourism?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Travel' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Why do people like to travel abroad?', 1),
    ('What are the disadvantages of mass tourism?', 2),
    ('Should governments promote domestic tourism?', 3),
    ('How has air travel changed tourism?', 4)
) AS q(text, question_order)
WHERE t.title = 'Travel' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Family (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Family',
    'part3', 
    '1. How has the family structure changed over the years?
2. Should children spend more time with their parents?
3. What are the advantages of living in a joint family?
4. Do you think family relationships are stronger than friendships?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Family' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('How has the family structure changed over the years?', 1),
    ('Should children spend more time with their parents?', 2),
    ('What are the advantages of living in a joint family?', 3),
    ('Do you think family relationships are stronger than friendships?', 4)
) AS q(text, question_order)
WHERE t.title = 'Family' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Language (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Language',
    'part3', 
    '1. Why is it important to learn foreign languages?
2. Do you think English will continue to dominate globally?
3. How does language affect culture?
4. Should schools teach more than one foreign language?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Language' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Why is it important to learn foreign languages?', 1),
    ('Do you think English will continue to dominate globally?', 2),
    ('How does language affect culture?', 3),
    ('Should schools teach more than one foreign language?', 4)
) AS q(text, question_order)
WHERE t.title = 'Language' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Art (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Art',
    'part3', 
    '1. Why do people value art?
2. Should art be compulsory in schools?
3. How does art reflect society?
4. Do you think traditional art is more valuable than modern art?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Art' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Why do people value art?', 1),
    ('Should art be compulsory in schools?', 2),
    ('How does art reflect society?', 3),
    ('Do you think traditional art is more valuable than modern art?', 4)
) AS q(text, question_order)
WHERE t.title = 'Art' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Economy (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Economy',
    'part3', 
    '1. What factors influence a country''s economic growth?
2. Do you think economic growth should be prioritized over environmental issues?
3. How does inflation affect people''s lives?
4. Should the government control prices of essential goods?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Economy' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What factors influence a country''s economic growth?', 1),
    ('Do you think economic growth should be prioritized over environmental issues?', 2),
    ('How does inflation affect people''s lives?', 3),
    ('Should the government control prices of essential goods?', 4)
) AS q(text, question_order)
WHERE t.title = 'Economy' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Transport (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Transport',
    'part3', 
    '1. What problems does traffic congestion cause in cities?
2. Should governments invest more in public transportation?
3. How will electric vehicles change transportation?
4. Do you think flying will become more popular in the future?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Transport' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What problems does traffic congestion cause in cities?', 1),
    ('Should governments invest more in public transportation?', 2),
    ('How will electric vehicles change transportation?', 3),
    ('Do you think flying will become more popular in the future?', 4)
) AS q(text, question_order)
WHERE t.title = 'Transport' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Science (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Science',
    'part3', 
    '1. How important is scientific research for a country''s development?
2. Do you think space exploration is worth the cost?
3. What are the negative impacts of scientific progress?
4. How has science improved our daily lives?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Science' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('How important is scientific research for a country''s development?', 1),
    ('Do you think space exploration is worth the cost?', 2),
    ('What are the negative impacts of scientific progress?', 3),
    ('How has science improved our daily lives?', 4)
) AS q(text, question_order)
WHERE t.title = 'Science' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Fashion (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Fashion',
    'part3', 
    '1. Why do people follow fashion trends?
2. Do you think fashion is important in the workplace?
3. How has the fashion industry changed in recent years?
4. Should fashion brands be more environmentally friendly?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Fashion' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Why do people follow fashion trends?', 1),
    ('Do you think fashion is important in the workplace?', 2),
    ('How has the fashion industry changed in recent years?', 3),
    ('Should fashion brands be more environmentally friendly?', 4)
) AS q(text, question_order)
WHERE t.title = 'Fashion' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Sports (NEW for Part 3)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Sports',
    'part3', 
    '1. Why are sports important for society?
2. Do you think professional athletes earn too much money?
3. How do sports influence children''s development?
4. Should governments fund sports facilities for everyone?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Sports' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Why are sports important for society?', 1),
    ('Do you think professional athletes earn too much money?', 2),
    ('How do sports influence children''s development?', 3),
    ('Should governments fund sports facilities for everyone?', 4)
) AS q(text, question_order)
WHERE t.title = 'Sports' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Happiness (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Happiness',
    'part3', 
    '1. What factors contribute most to happiness?
2. Do you think money is essential for happiness?
3. Can governments do anything to make people happier?
4. How does work-life balance affect happiness?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Happiness' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('What factors contribute most to happiness?', 1),
    ('Do you think money is essential for happiness?', 2),
    ('Can governments do anything to make people happier?', 3),
    ('How does work-life balance affect happiness?', 4)
) AS q(text, question_order)
WHERE t.title = 'Happiness' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

-- Future of Work (NEW)
INSERT INTO topics (title, part, questions, estimated_time)
SELECT 
    'Future of Work',
    'part3', 
    '1. Do you think AI will replace most human jobs?
2. How will remote working trends change in the future?
3. What skills will be important for future careers?
4. Should schools prepare students for jobs that don''t exist yet?', 
    '5-6 min'
WHERE NOT EXISTS (
    SELECT 1 FROM topics WHERE title = 'Future of Work' AND part = 'part3'
);

INSERT INTO questions (topic_id, text, question_order, part)
SELECT 
    t.id,
    q.text,
    q.question_order,
    'part3'
FROM topics t
CROSS JOIN (VALUES 
    ('Do you think AI will replace most human jobs?', 1),
    ('How will remote working trends change in the future?', 2),
    ('What skills will be important for future careers?', 3),
    ('Should schools prepare students for jobs that don''t exist yet?', 4)
) AS q(text, question_order)
WHERE t.title = 'Future of Work' AND t.part = 'part3'
AND NOT EXISTS (
    SELECT 1 FROM questions 
    WHERE topic_id = t.id AND question_order = q.question_order
);

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

-- Show newly added topics
SELECT 
    t.title,
    t.part,
    COUNT(q.id) as question_count
FROM topics t
LEFT JOIN questions q ON t.id = q.topic_id
WHERE t.created_at >= CURRENT_DATE - INTERVAL '1 hour'
AND t.part IN ('part1', 'part3')
GROUP BY t.id, t.title, t.part
ORDER BY t.part, t.title
LIMIT 20;