-- Updated Topics table for IELTS speaking practice
-- Removed category (all are speaking), renamed description to questions
-- Contains all actual questions from CSV data

-- Create the topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  part VARCHAR(10) NOT NULL CHECK (part IN ('part1', 'part3')),
  questions TEXT NOT NULL,
  estimated_time VARCHAR(20) DEFAULT '5 min',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create the questions table (individual questions for each topic)
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  question_order INTEGER NOT NULL CHECK (question_order BETWEEN 1 AND 4),
  part VARCHAR(10) NOT NULL CHECK (part IN ('part1', 'part3')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(topic_id, question_order)
);

-- Create user_topic_progress table to track individual user progress
CREATE TABLE IF NOT EXISTS user_topic_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, topic_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_topics_part ON topics(part);
CREATE INDEX IF NOT EXISTS idx_topics_title ON topics(title);
CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_part ON questions(part);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_user_id ON user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_topic_progress_topic_id ON user_topic_progress(topic_id);

-- Set up Row Level Security (RLS)
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for topics table (public read access)
CREATE POLICY "Topics are viewable by everyone" ON topics
  FOR SELECT USING (true);

-- RLS Policies for questions table (public read access)
CREATE POLICY "Questions are viewable by everyone" ON questions
  FOR SELECT USING (true);

-- RLS Policies for user_topic_progress table
CREATE POLICY "Users can view their own progress" ON user_topic_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON user_topic_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON user_topic_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_topics_updated_at BEFORE UPDATE ON topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_topic_progress_updated_at BEFORE UPDATE ON user_topic_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Part 1 topics with actual questions from CSV
INSERT INTO topics (title, part, questions) VALUES
('Hometown', 'part1', 'Practice questions about your hometown and local area'),
('Work or Studies', 'part1', 'Practice questions about your work or educational background'),
('Daily Routine', 'part1', 'Practice questions about your daily activities and schedule'),
('Reading', 'part1', 'Practice questions about your reading habits and preferences'),
('Music', 'part1', 'Practice questions about your musical preferences and listening habits'),
('Social Media', 'part1', 'Practice questions about your social media usage and preferences'),
('Weather', 'part1', 'Practice questions about weather and climate preferences'),
('Food', 'part1', 'Practice questions about your food preferences and cooking habits'),
('Sports', 'part1', 'Practice questions about sports and physical activities'),
('Technology', 'part1', 'Practice questions about your technology usage and preferences'),
('Travel', 'part1', 'Practice questions about your travel experiences and preferences'),
('Shopping', 'part1', 'Practice questions about your shopping habits and preferences'),
('Television & Streaming', 'part1', 'Practice questions about your TV and streaming preferences'),
('Pets', 'part1', 'Practice questions about pets and animals'),
('Sleep', 'part1', 'Practice questions about your sleep patterns and habits');

-- Insert Part 3 topics with actual questions from CSV
INSERT INTO topics (title, part, questions) VALUES
('Education', 'part3', 'Analytical questions about educational systems and learning methods'),
('Technology', 'part3', 'Analytical questions about technology role in modern life'),
('Environment', 'part3', 'Analytical questions about environmental issues and solutions'),
('Health', 'part3', 'Analytical questions about health trends and medical care systems'),
('Globalization', 'part3', 'Analytical questions about globalization effects on society'),
('Media', 'part3', 'Analytical questions about media influence and journalism'),
('Culture', 'part3', 'Analytical questions about cultural differences and preservation'),
('Crime', 'part3', 'Analytical questions about crime prevention and justice systems'),
('Work', 'part3', 'Analytical questions about employment trends and workplace issues'),
('Travel', 'part3', 'Analytical questions about tourism and its global impact'),
('Family', 'part3', 'Analytical questions about family structures and relationships'),
('Language', 'part3', 'Analytical questions about language learning and global communication'),
('Art', 'part3', 'Analytical questions about the role and value of art in society'),
('Economy', 'part3', 'Analytical questions about economic factors and policies'),
('Transport', 'part3', 'Analytical questions about transportation systems and urban planning'),
('Science', 'part3', 'Analytical questions about scientific research and technological progress'),
('Fashion', 'part3', 'Analytical questions about fashion trends and industry impact'),
('Sports', 'part3', 'Analytical questions about the role of sports in society'),
('Happiness', 'part3', 'Analytical questions about factors affecting well-being and life satisfaction'),
('Future of Work', 'part3', 'Analytical questions about changing work patterns and career development');

-- Now insert all the individual questions using a simpler approach
-- We'll use a series of individual INSERT statements instead of a complex function

-- Get topic IDs and insert questions for each topic
DO $$
DECLARE
    hometown_id UUID;
    work_studies_id UUID;
    daily_routine_id UUID;
    reading_id UUID;
    music_id UUID;
    social_media_id UUID;
    weather_id UUID;
    food_id UUID;
    sports_id UUID;
    technology_p1_id UUID;
    travel_p1_id UUID;
    shopping_id UUID;
    tv_streaming_id UUID;
    pets_id UUID;
    sleep_id UUID;
    education_id UUID;
    technology_p3_id UUID;
    environment_id UUID;
    health_id UUID;
    globalization_id UUID;
    media_id UUID;
    culture_id UUID;
    crime_id UUID;
    work_p3_id UUID;
    travel_p3_id UUID;
    family_id UUID;
    language_id UUID;
    art_id UUID;
    economy_id UUID;
    transport_id UUID;
    science_id UUID;
    fashion_id UUID;
    sports_p3_id UUID;
    happiness_id UUID;
    future_work_id UUID;
BEGIN
    -- Get all topic IDs
    SELECT id INTO hometown_id FROM topics WHERE title = 'Hometown' AND part = 'part1';
    SELECT id INTO work_studies_id FROM topics WHERE title = 'Work or Studies' AND part = 'part1';
    SELECT id INTO daily_routine_id FROM topics WHERE title = 'Daily Routine' AND part = 'part1';
    SELECT id INTO reading_id FROM topics WHERE title = 'Reading' AND part = 'part1';
    SELECT id INTO music_id FROM topics WHERE title = 'Music' AND part = 'part1';
    SELECT id INTO social_media_id FROM topics WHERE title = 'Social Media' AND part = 'part1';
    SELECT id INTO weather_id FROM topics WHERE title = 'Weather' AND part = 'part1';
    SELECT id INTO food_id FROM topics WHERE title = 'Food' AND part = 'part1';
    SELECT id INTO sports_id FROM topics WHERE title = 'Sports' AND part = 'part1';
    SELECT id INTO technology_p1_id FROM topics WHERE title = 'Technology' AND part = 'part1';
    SELECT id INTO travel_p1_id FROM topics WHERE title = 'Travel' AND part = 'part1';
    SELECT id INTO shopping_id FROM topics WHERE title = 'Shopping' AND part = 'part1';
    SELECT id INTO tv_streaming_id FROM topics WHERE title = 'Television & Streaming' AND part = 'part1';
    SELECT id INTO pets_id FROM topics WHERE title = 'Pets' AND part = 'part1';
    SELECT id INTO sleep_id FROM topics WHERE title = 'Sleep' AND part = 'part1';
    
    SELECT id INTO education_id FROM topics WHERE title = 'Education' AND part = 'part3';
    SELECT id INTO technology_p3_id FROM topics WHERE title = 'Technology' AND part = 'part3';
    SELECT id INTO environment_id FROM topics WHERE title = 'Environment' AND part = 'part3';
    SELECT id INTO health_id FROM topics WHERE title = 'Health' AND part = 'part3';
    SELECT id INTO globalization_id FROM topics WHERE title = 'Globalization' AND part = 'part3';
    SELECT id INTO media_id FROM topics WHERE title = 'Media' AND part = 'part3';
    SELECT id INTO culture_id FROM topics WHERE title = 'Culture' AND part = 'part3';
    SELECT id INTO crime_id FROM topics WHERE title = 'Crime' AND part = 'part3';
    SELECT id INTO work_p3_id FROM topics WHERE title = 'Work' AND part = 'part3';
    SELECT id INTO travel_p3_id FROM topics WHERE title = 'Travel' AND part = 'part3';
    SELECT id INTO family_id FROM topics WHERE title = 'Family' AND part = 'part3';
    SELECT id INTO language_id FROM topics WHERE title = 'Language' AND part = 'part3';
    SELECT id INTO art_id FROM topics WHERE title = 'Art' AND part = 'part3';
    SELECT id INTO economy_id FROM topics WHERE title = 'Economy' AND part = 'part3';
    SELECT id INTO transport_id FROM topics WHERE title = 'Transport' AND part = 'part3';
    SELECT id INTO science_id FROM topics WHERE title = 'Science' AND part = 'part3';
    SELECT id INTO fashion_id FROM topics WHERE title = 'Fashion' AND part = 'part3';
    SELECT id INTO sports_p3_id FROM topics WHERE title = 'Sports' AND part = 'part3';
    SELECT id INTO happiness_id FROM topics WHERE title = 'Happiness' AND part = 'part3';
    SELECT id INTO future_work_id FROM topics WHERE title = 'Future of Work' AND part = 'part3';

    -- Insert Hometown questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (hometown_id, 'Where do you usually go when you want to relax in your hometown?', 1, 'part1'),
    (hometown_id, 'What do you like most about your hometown?', 2, 'part1'),
    (hometown_id, 'Has your hometown changed much in recent years?', 3, 'part1'),
    (hometown_id, 'Would you like to live in your hometown in the future?', 4, 'part1');

    -- Insert Work or Studies questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (work_studies_id, 'What do you enjoy most about your work or studies?', 1, 'part1'),
    (work_studies_id, 'Why did you choose your current field of study or job?', 2, 'part1'),
    (work_studies_id, 'Do you prefer working alone or in a team?', 3, 'part1'),
    (work_studies_id, 'What is the most challenging part of your studies or work?', 4, 'part1');

    -- Insert Daily Routine questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (daily_routine_id, 'How do you usually spend your mornings?', 1, 'part1'),
    (daily_routine_id, 'What is your favorite part of the day?', 2, 'part1'),
    (daily_routine_id, 'Do you prefer having a fixed routine or a flexible one?', 3, 'part1'),
    (daily_routine_id, 'Has your daily routine changed recently?', 4, 'part1');

    -- Insert Reading questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (reading_id, 'Do you prefer reading e-books or printed books? Why?', 1, 'part1'),
    (reading_id, 'How often do you read for pleasure?', 2, 'part1'),
    (reading_id, 'What kind of books do you like reading?', 3, 'part1'),
    (reading_id, 'Do you think reading is important for learning?', 4, 'part1');

    -- Insert Music questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (music_id, 'What type of music do you usually listen to?', 1, 'part1'),
    (music_id, 'Do you like listening to music while studying or working?', 2, 'part1'),
    (music_id, 'Have your music preferences changed over time?', 3, 'part1'),
    (music_id, 'Do you prefer live concerts or listening to recorded music?', 4, 'part1');

    -- Insert Social Media questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (social_media_id, 'How often do you post on social media?', 1, 'part1'),
    (social_media_id, 'Do you think social media is a good way to stay in touch with friends?', 2, 'part1'),
    (social_media_id, 'What do you usually post on social media?', 3, 'part1'),
    (social_media_id, 'Have you ever taken a break from social media?', 4, 'part1');

    -- Insert Weather questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (weather_id, 'What is your favorite season of the year? Why?', 1, 'part1'),
    (weather_id, 'Do you prefer hot weather or cold weather?', 2, 'part1'),
    (weather_id, 'How does the weather affect your mood?', 3, 'part1'),
    (weather_id, 'Have you ever experienced extreme weather conditions?', 4, 'part1');

    -- Insert Food questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (food_id, 'Do you like trying new kinds of food?', 1, 'part1'),
    (food_id, 'What is your favorite type of cuisine?', 2, 'part1'),
    (food_id, 'How often do you eat out at restaurants?', 3, 'part1'),
    (food_id, 'Do you prefer cooking at home or eating out?', 4, 'part1');

    -- Insert Sports questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (sports_id, 'What sport do you enjoy watching or playing the most?', 1, 'part1'),
    (sports_id, 'Did you play any sports when you were a child?', 2, 'part1'),
    (sports_id, 'Do you prefer team sports or individual sports?', 3, 'part1'),
    (sports_id, 'How often do you exercise or play sports now?', 4, 'part1');

    -- Insert Technology questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (technology_p1_id, 'What technology do you use the most in your daily life?', 1, 'part1'),
    (technology_p1_id, 'Do you prefer using a laptop or a smartphone?', 2, 'part1'),
    (technology_p1_id, 'Has technology changed the way you communicate?', 3, 'part1'),
    (technology_p1_id, 'What is a piece of technology you cannot live without?', 4, 'part1');

    -- Insert Travel questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (travel_p1_id, 'Do you prefer traveling alone or with friends?', 1, 'part1'),
    (travel_p1_id, 'What is your favorite type of holiday?', 2, 'part1'),
    (travel_p1_id, 'Do you like visiting new places or going back to familiar ones?', 3, 'part1'),
    (travel_p1_id, 'What was your most memorable trip?', 4, 'part1');

    -- Insert Shopping questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (shopping_id, 'Do you enjoy shopping in malls or online?', 1, 'part1'),
    (shopping_id, 'What was the last thing you bought?', 2, 'part1'),
    (shopping_id, 'Do you prefer buying branded items or not?', 3, 'part1'),
    (shopping_id, 'Do you like shopping with friends or alone?', 4, 'part1');

    -- Insert Television & Streaming questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (tv_streaming_id, 'Do you often watch TV series or movies?', 1, 'part1'),
    (tv_streaming_id, 'Do you prefer watching movies at home or in the cinema?', 2, 'part1'),
    (tv_streaming_id, 'What is your favorite TV show?', 3, 'part1'),
    (tv_streaming_id, 'Do you think people watch too much TV nowadays?', 4, 'part1');

    -- Insert Pets questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (pets_id, 'Would you like to have a pet in the future?', 1, 'part1'),
    (pets_id, 'Did you have a pet when you were a child?', 2, 'part1'),
    (pets_id, 'What animals do you like the most?', 3, 'part1'),
    (pets_id, 'Do you think pets make people happier?', 4, 'part1');

    -- Insert Sleep questions (Part 1)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (sleep_id, 'How many hours do you usually sleep every night?', 1, 'part1'),
    (sleep_id, 'Do you take naps during the day?', 2, 'part1'),
    (sleep_id, 'What do you do if you cannot fall asleep?', 3, 'part1'),
    (sleep_id, 'Has your sleeping pattern changed recently?', 4, 'part1');

    -- Insert Education questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (education_id, 'How has education changed in your country over the years?', 1, 'part3'),
    (education_id, 'Should education be free for everyone?', 2, 'part3'),
    (education_id, 'Do you think exams are the best way to assess students?', 3, 'part3'),
    (education_id, 'How important is practical knowledge compared to theoretical knowledge?', 4, 'part3');

    -- Insert Technology questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (technology_p3_id, 'How has technology changed the way people interact?', 1, 'part3'),
    (technology_p3_id, 'Do you think people rely too much on technology today?', 2, 'part3'),
    (technology_p3_id, 'What are the pros and cons of using technology in education?', 3, 'part3'),
    (technology_p3_id, 'How do you see technology evolving in the next decade?', 4, 'part3');

    -- Insert Environment questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (environment_id, 'What are the biggest environmental problems in your country?', 1, 'part3'),
    (environment_id, 'Who should take more responsibility for protecting the environment: individuals or governments?', 2, 'part3'),
    (environment_id, 'How effective are international agreements on climate change?', 3, 'part3'),
    (environment_id, 'What can be done to encourage people to recycle more?', 4, 'part3');

    -- Insert Health questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (health_id, 'Do you think people today are healthier than in the past?', 1, 'part3'),
    (health_id, 'Should governments spend more on healthcare than on the military?', 2, 'part3'),
    (health_id, 'How can people be encouraged to live healthier lives?', 3, 'part3'),
    (health_id, 'What role does mental health play in overall well-being?', 4, 'part3');

    -- Insert Globalization questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (globalization_id, 'How has globalization affected your country?', 1, 'part3'),
    (globalization_id, 'Do you think globalization is good for local cultures?', 2, 'part3'),
    (globalization_id, 'What are the benefits and drawbacks of globalization?', 3, 'part3'),
    (globalization_id, 'How has globalization changed the job market?', 4, 'part3');

    -- Insert Media questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (media_id, 'Do you think the media influences public opinion?', 1, 'part3'),
    (media_id, 'How has social media changed news reporting?', 2, 'part3'),
    (media_id, 'Should the government regulate media content?', 3, 'part3'),
    (media_id, 'Do people trust the news nowadays? Why or why not?', 4, 'part3');

    -- Insert Culture questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (culture_id, 'Why is it important to preserve traditional culture?', 1, 'part3'),
    (culture_id, 'How do cultural values influence people''s behavior?', 2, 'part3'),
    (culture_id, 'Should governments invest in preserving heritage sites?', 3, 'part3'),
    (culture_id, 'How has modernization affected cultural traditions?', 4, 'part3');

    -- Insert Crime questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (crime_id, 'What are the main causes of crime in society?', 1, 'part3'),
    (crime_id, 'Do you think severe punishment reduces crime?', 2, 'part3'),
    (crime_id, 'How effective are community programs in preventing crime?', 3, 'part3'),
    (crime_id, 'Should the death penalty still be used?', 4, 'part3');

    -- Insert Work questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (work_p3_id, 'How has remote work changed people''s lives?', 1, 'part3'),
    (work_p3_id, 'Do you think job satisfaction is more important than salary?', 2, 'part3'),
    (work_p3_id, 'What are the challenges of working in large companies?', 3, 'part3'),
    (work_p3_id, 'How will automation impact future employment?', 4, 'part3');

    -- Insert Travel questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (travel_p3_id, 'Why do people like to travel abroad?', 1, 'part3'),
    (travel_p3_id, 'What are the disadvantages of mass tourism?', 2, 'part3'),
    (travel_p3_id, 'Should governments promote domestic tourism?', 3, 'part3'),
    (travel_p3_id, 'How has air travel changed tourism?', 4, 'part3');

    -- Insert Family questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (family_id, 'How has the family structure changed over the years?', 1, 'part3'),
    (family_id, 'Should children spend more time with their parents?', 2, 'part3'),
    (family_id, 'What are the advantages of living in a joint family?', 3, 'part3'),
    (family_id, 'Do you think family relationships are stronger than friendships?', 4, 'part3');

    -- Insert Language questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (language_id, 'Why is it important to learn foreign languages?', 1, 'part3'),
    (language_id, 'Do you think English will continue to dominate globally?', 2, 'part3'),
    (language_id, 'How does language affect culture?', 3, 'part3'),
    (language_id, 'Should schools teach more than one foreign language?', 4, 'part3');

    -- Insert Art questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (art_id, 'Why do people value art?', 1, 'part3'),
    (art_id, 'Should art be compulsory in schools?', 2, 'part3'),
    (art_id, 'How does art reflect society?', 3, 'part3'),
    (art_id, 'Do you think traditional art is more valuable than modern art?', 4, 'part3');

    -- Insert Economy questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (economy_id, 'What factors influence a country''s economic growth?', 1, 'part3'),
    (economy_id, 'Do you think economic growth should be prioritized over environmental issues?', 2, 'part3'),
    (economy_id, 'How does inflation affect people''s lives?', 3, 'part3'),
    (economy_id, 'Should the government control prices of essential goods?', 4, 'part3');

    -- Insert Transport questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (transport_id, 'What problems does traffic congestion cause in cities?', 1, 'part3'),
    (transport_id, 'Should governments invest more in public transportation?', 2, 'part3'),
    (transport_id, 'How will electric vehicles change transportation?', 3, 'part3'),
    (transport_id, 'Do you think flying will become more popular in the future?', 4, 'part3');

    -- Insert Science questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (science_id, 'How important is scientific research for a country''s development?', 1, 'part3'),
    (science_id, 'Do you think space exploration is worth the cost?', 2, 'part3'),
    (science_id, 'What are the negative impacts of scientific progress?', 3, 'part3'),
    (science_id, 'How has science improved our daily lives?', 4, 'part3');

    -- Insert Fashion questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (fashion_id, 'Why do people follow fashion trends?', 1, 'part3'),
    (fashion_id, 'Do you think fashion is important in the workplace?', 2, 'part3'),
    (fashion_id, 'How has the fashion industry changed in recent years?', 3, 'part3'),
    (fashion_id, 'Should fashion brands be more environmentally friendly?', 4, 'part3');

    -- Insert Sports questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (sports_p3_id, 'Why are sports important for society?', 1, 'part3'),
    (sports_p3_id, 'Do you think professional athletes earn too much money?', 2, 'part3'),
    (sports_p3_id, 'How do sports influence children''s development?', 3, 'part3'),
    (sports_p3_id, 'Should governments fund sports facilities for everyone?', 4, 'part3');

    -- Insert Happiness questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (happiness_id, 'What factors contribute most to happiness?', 1, 'part3'),
    (happiness_id, 'Do you think money is essential for happiness?', 2, 'part3'),
    (happiness_id, 'Can governments do anything to make people happier?', 3, 'part3'),
    (happiness_id, 'How does work-life balance affect happiness?', 4, 'part3');

    -- Insert Future of Work questions (Part 3)
    INSERT INTO questions (topic_id, text, question_order, part) VALUES
    (future_work_id, 'Do you think AI will replace most human jobs?', 1, 'part3'),
    (future_work_id, 'How will remote working trends change in the future?', 2, 'part3'),
    (future_work_id, 'What skills will be important for future careers?', 3, 'part3'),
    (future_work_id, 'Should schools prepare students for jobs that do not exist yet?', 4, 'part3');

END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON topics TO anon, authenticated;
GRANT SELECT ON questions TO anon, authenticated;
GRANT ALL ON user_topic_progress TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;