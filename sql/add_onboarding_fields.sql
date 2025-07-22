-- Migration: Add onboarding fields to user_profiles table
-- This adds the necessary fields for tracking onboarding completion and study goals

-- Add onboarding_completed column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Add study_goal column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS study_goal VARCHAR(50);

-- Create index on onboarding_completed for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed 
ON user_profiles(onboarding_completed);

-- Update any existing users to have onboarding_completed = true
-- (assuming existing users have already gone through some form of setup)
UPDATE user_profiles 
SET onboarding_completed = TRUE 
WHERE full_name IS NOT NULL 
  AND target_band_score IS NOT NULL 
  AND current_level IS NOT NULL;