import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envContent = readFileSync('.env.local', 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, value] = trimmed.split('=');
        if (key && value) {
          env[key.trim()] = value.trim();
        }
      }
    });
    return env;
  } catch (error) {
    console.log('Warning: Could not read .env.local file');
    return {};
  }
}

// Delete user function
async function deleteUser() {
  console.log('🗑️  Delete User Tool\n');

  const env = loadEnvFile();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing required configuration');
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  // List all users first
  console.log('🔍 Listing all users...');
  try {
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Could not list users:', listError.message);
      return;
    }

    if (users.users.length === 0) {
      console.log('✅ No users found');
      return;
    }

    console.log('📋 Current users:');
    users.users.forEach((user, index) => {
      const confirmed = user.email_confirmed_at ? '✅' : '❌';
      console.log(`${index + 1}. ${user.email} (ID: ${user.id}) ${confirmed}`);
    });
    console.log('');

    // Ask for user input (in a real scenario, you'd modify this script)
    const userEmail = 'jack@qq.com'; // Change this to the email you want to delete

    console.log(`🔍 Looking for user: ${userEmail}`);
    
    const userToDelete = users.users.find(u => u.email === userEmail);
    
    if (!userToDelete) {
      console.log('❌ User not found:', userEmail);
      return;
    }

    console.log('📋 User to delete:');
    console.log('  Email:', userToDelete.email);
    console.log('  User ID:', userToDelete.id);
    console.log('  Created at:', userToDelete.created_at);
    console.log('  Email confirmed:', userToDelete.email_confirmed_at ? 'Yes' : 'No');
    console.log('');

    // Check if user has profile
    console.log('🔍 Checking user profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userToDelete.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.log('❌ Error checking profile:', profileError.message);
    } else if (profile) {
      console.log('✅ User profile found:');
      console.log('  Username:', profile.username);
      console.log('  Avatar:', profile.avatar);
      console.log('  Created at:', profile.created_at);
    } else {
      console.log('ℹ️  No user profile found');
    }
    console.log('');

    // Confirm deletion
    console.log('⚠️  WARNING: This action cannot be undone!');
    console.log('🔧 Deleting user and all associated data...');
    
    try {
      // Delete user profile first (foreign key constraint)
      if (profile) {
        const { error: deleteProfileError } = await supabaseAdmin
          .from('user_profiles')
          .delete()
          .eq('id', userToDelete.id);

        if (deleteProfileError) {
          console.log('❌ Failed to delete profile:', deleteProfileError.message);
        } else {
          console.log('✅ User profile deleted');
        }
      }

      // Delete the user from auth
      const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
        userToDelete.id
      );

      if (deleteUserError) {
        console.log('❌ Failed to delete user:', deleteUserError.message);
      } else {
        console.log('✅ User deleted successfully!');
      }

      console.log('');
      console.log('🎉 User deletion completed!');
      console.log(`📧 User ${userEmail} has been permanently deleted`);

    } catch (err) {
      console.log('❌ Error during deletion:', err.message);
    }

  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

// Run the deletion
deleteUser().catch(console.error);