-- Fix RLS policies for user_profiles table
-- This script should be run in the Supabase SQL Editor

-- First, let's check current policies
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Add policy to allow service role to insert profiles
-- This is needed for the registration API to work
CREATE POLICY "Service role can manage profiles" 
ON user_profiles 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" 
ON user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Add policy to allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON user_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Add policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Verify the policies were created
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';

-- Note: If you get any errors, make sure:
-- 1. RLS is enabled on the user_profiles table
-- 2. You're running this as a superuser or service role