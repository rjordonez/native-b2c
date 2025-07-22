-- B2C Database Schema for IELTS Application
-- This script creates the B2C user table for the IELTS application
-- Table name is prefixed with 'b2c_' to distinguish from other projects

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- B2C User table for IELTS application
CREATE TABLE b2c_user (
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
CREATE INDEX idx_b2c_user_email ON b2c_user(email);
CREATE INDEX idx_b2c_user_username ON b2c_user(username);
CREATE INDEX idx_b2c_user_auth_user_id ON b2c_user(auth_user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger
CREATE TRIGGER update_b2c_user_updated_at BEFORE UPDATE ON b2c_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE b2c_user ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can view their own profile" ON b2c_user FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON b2c_user FOR UPDATE USING (auth_user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON b2c_user FOR INSERT WITH CHECK (auth_user_id = auth.uid());