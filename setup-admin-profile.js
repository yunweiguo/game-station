const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yamnjacfukhjeioqngja.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbW5qYWNmdWtoamVpb3FuZ2phIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0MjI0NywiZXhwIjoyMDcyNTE4MjQ3fQ.LRdG3u3fgNWSpsPdwJmBaHfRebxTqeqetmcuMbQRJc4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdminProfile() {
  try {
    console.log('Setting up admin profile...');
    
    // First, let's try to create the profile directly
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: '8d31df39-fcda-4ace-8f84-6f8709dfeedd',
        username: 'admin',
        email: 'admin@gamestation.com',
        role: 'admin',
        status: 'active',
        email_verified: true,
      })
      .select();
    
    if (error) {
      console.error('Error creating admin profile:', error);
      
      // If table doesn't exist, we need to create it manually in Supabase dashboard
      console.log('\nPlease create the user_profiles table manually in Supabase:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Click on "SQL Editor"');
      console.log('3. Run the following SQL:');
      console.log(`
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage all profiles" ON user_profiles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insert admin profile
INSERT INTO user_profiles (id, username, email, role, status, email_verified)
VALUES ('8d31df39-fcda-4ace-8f84-6f8709dfeedd', 'admin', 'admin@gamestation.com', 'admin', 'active', true)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  email_verified = EXCLUDED.email_verified;
      `);
      
    } else {
      console.log('Admin profile created successfully:', data);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

setupAdminProfile();