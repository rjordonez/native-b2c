-- Complete User Profile Setup for IELTS Application
-- Run this entire script in your Supabase SQL editor

-- 1. First, add any missing columns to the existing user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS study_goal TEXT;

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- 2. Create function to handle new user creation (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if profile already exists (to prevent duplicates)
  IF NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE auth_user_id = NEW.id) THEN
    INSERT INTO public.user_profiles (
      auth_user_id,
      email,
      full_name,
      avatar_url,
      onboarding_completed,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NULL, -- Avatar will be generated during onboarding
      FALSE, -- Not onboarded yet
      NOW(),
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4. Create trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Update existing users who might not have profiles
-- This creates profiles for any existing auth users who don't have one
INSERT INTO public.user_profiles (auth_user_id, email, full_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.user_profiles up ON au.id = up.auth_user_id
WHERE up.id IS NULL;

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- 7. Ensure RLS is properly set up (from original b2c_tables.sql)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Recreate RLS policies
CREATE POLICY "Users can view their own profile" 
ON user_profiles FOR SELECT 
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON user_profiles FOR UPDATE 
USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" 
ON user_profiles FOR INSERT 
WITH CHECK (auth_user_id = auth.uid());

-- 8. Create storage bucket policies (run after creating 'avatars' bucket in dashboard)
-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Anyone can view avatars (public read access)
CREATE POLICY "Public avatar access" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');