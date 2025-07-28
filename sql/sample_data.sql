-- Sample Data for IELTS Speaking Practice App
-- This file contains the current data from your database

-- Sample Topics Data (35 total topics)
INSERT INTO public.topics (id, title, part, questions, estimated_time, created_at, updated_at) VALUES

-- Part 1 Topics (15 topics)
('77f5d596-c785-443e-a266-55dcc9e947ce', 'Hometown', 'part1', 'Practice questions about your hometown and local area', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('4c941695-abe4-44cc-8bb4-7dd347b30221', 'Work or Studies', 'part1', 'Practice questions about your work or educational background', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('a5ccc150-6bfc-42d3-85f1-05d403913da4', 'Daily Routine', 'part1', 'Practice questions about your daily activities and schedule', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('6dd36543-46e9-4f4d-9e12-62eaf9f49abf', 'Reading', 'part1', 'Practice questions about your reading habits and preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('6ad9dbdc-7371-4d5d-89c6-62a9bf80e351', 'Music', 'part1', 'Practice questions about your musical preferences and listening habits', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('ef3dec67-db31-4418-ae96-16b0fa526a42', 'Social Media', 'part1', 'Practice questions about your social media usage and preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('f973a91b-86b6-4470-95d5-58c656cf7523', 'Weather', 'part1', 'Practice questions about weather and climate preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('dc38b5dd-c37a-4f8c-81ca-a13411f5a208', 'Food', 'part1', 'Practice questions about your food preferences and cooking habits', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('44da3726-b703-4152-a757-f16317941d28', 'Sports', 'part1', 'Practice questions about sports and physical activities', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('3b50ec77-a24b-4d04-b770-d1f71da0b711', 'Technology', 'part1', 'Practice questions about your technology usage and preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('3704ddf1-dcd4-42e8-86a3-6104ffd23b4f', 'Travel', 'part1', 'Practice questions about your travel experiences and preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('9695c7ef-7d24-4e2e-9ff9-a7f50de3b0a8', 'Shopping', 'part1', 'Practice questions about your shopping habits and preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('038cd0f0-8977-488b-aaa0-e33e35d3188c', 'Television & Streaming', 'part1', 'Practice questions about your TV and streaming preferences', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('a02bdd68-0d2f-49ee-9e6e-74671744c4a9', 'Pets', 'part1', 'Practice questions about pets and animals', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('6b5e67ce-787c-41fc-ad9f-378722592a7e', 'Sleep', 'part1', 'Practice questions about your sleep patterns and habits', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),

-- Part 3 Topics (20 topics)
('ad8c5c24-f604-4f78-bcbe-67a4214f39cc', 'Education', 'part3', 'Analytical questions about educational systems and learning methods', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('23f5e041-b1e7-47f5-aa00-ec9347637ebd', 'Technology', 'part3', 'Analytical questions about technology role in modern life', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('1e1afb7c-d7e7-4b11-9191-d718e56c3510', 'Environment', 'part3', 'Analytical questions about environmental issues and solutions', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('2d42d3c7-7513-4525-a42a-eb3359b0bbbc', 'Health', 'part3', 'Analytical questions about health trends and medical care systems', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('37867e86-d46b-4d6e-b396-c9472e7176f5', 'Globalization', 'part3', 'Analytical questions about globalization effects on society', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('44f82cc4-5814-4ca5-8775-c46352ff1773', 'Media', 'part3', 'Analytical questions about media influence and journalism', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('48e85368-77a6-4fb3-b361-660849860e35', 'Culture', 'part3', 'Analytical questions about cultural differences and preservation', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('91d6520b-e1d9-4f97-aef2-0587cedbf8aa', 'Crime', 'part3', 'Analytical questions about crime prevention and justice systems', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('3c80fc9f-8ecf-4fb6-9940-a3e4ce07c2f7', 'Work', 'part3', 'Analytical questions about employment trends and workplace issues', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('b263b632-c533-4fe5-a85a-d2b0ff6b0c9a', 'Travel', 'part3', 'Analytical questions about tourism and its global impact', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('1013ad70-f7bd-42ee-9097-11ac1a7fb02d', 'Family', 'part3', 'Analytical questions about family structures and relationships', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('e636eae0-3556-474f-8e84-af09f5156dd1', 'Language', 'part3', 'Analytical questions about language learning and global communication', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('333a326f-2cf2-4f22-b5d8-96262a95cd70', 'Art', 'part3', 'Analytical questions about the role and value of art in society', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('51d649ea-bd23-4c28-a053-1386f98ff831', 'Economy', 'part3', 'Analytical questions about economic factors and policies', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('1eb2c754-42d5-493b-986c-39d0a6d94146', 'Transport', 'part3', 'Analytical questions about transportation systems and urban planning', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('72fd7f7a-4968-4649-8af7-bf1fa6e44ad8', 'Science', 'part3', 'Analytical questions about scientific research and technological progress', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('3638e167-759e-441e-a582-a400cb49ee5d', 'Fashion', 'part3', 'Analytical questions about fashion trends and industry impact', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('cd12be60-a5de-4425-bdf1-69dc2deb2866', 'Sports', 'part3', 'Analytical questions about the role of sports in society', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('10db47b0-2879-4677-9644-8e795bbb8b33', 'Happiness', 'part3', 'Analytical questions about factors affecting well-being and life satisfaction', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00'),
('032bad33-cd03-4f2f-9726-d9bf9b78e32a', 'Future of Work', 'part3', 'Analytical questions about changing work patterns and career development', '5 min', '2025-07-24 15:44:27.3783+00', '2025-07-24 15:44:27.3783+00')

ON CONFLICT (id) DO NOTHING;

-- Note: This database contains 140 individual questions (4 questions per topic)
-- Each topic has exactly 4 questions ordered 1-4
-- Questions are stored in the 'questions' table with foreign key references to topics

-- Example questions structure (showing first few):
-- Art (Part 3):
--   1. "Why do people value art?"
--   2. "Should art be compulsory in schools?"
--   3. "How does art reflect society?"
--   4. "Do you think traditional art is more valuable than modern art?"

-- Daily Routine (Part 1):
--   1. "How do you usually spend your mornings?"
--   2. "What is your favorite part of the day?"
--   3. "Do you prefer having a fixed routine or a flexible one?"
--   4. "Has your daily routine changed recently?"

-- The questions table contains all 140 individual questions
-- linked to their respective topics through the topic_id foreign key