-- User Profile Database Schema for Native Speaking Application
-- This script creates the user profile table for the application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID NOT NULL, -- References auth.users from Supabase
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    avatar_url TEXT,
    phone VARCHAR(20),
    country VARCHAR(50),
    target_band_score DECIMAL(2, 1), -- IELTS band score (e.g., 7.5)
    current_level VARCHAR(20), -- beginner, intermediate, advanced
    test_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_auth_user FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_auth_user_id ON user_profiles(auth_user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth_user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth_user_id = auth.uid());