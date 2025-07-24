-- Migration to add missing columns to user_profiles table

-- Add study_goal column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS study_goal TEXT;

-- Add onboarding_completed column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add any other missing columns that might be needed
-- The avatar_url column already exists, so we don't need to add it