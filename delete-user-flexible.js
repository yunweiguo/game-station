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

// Delete specific user by email
async function deleteUserByEmail(userEmail) {
  console.log(`🗑️  Delete User: ${userEmail}\n`);

  const env = loadEnvFile();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing required configuration');
    return false;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // List users to find the target user
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Could not list users:', listError.message);
      return false;
    }

    const userToDelete = users.users.find(u => u.email === userEmail);
    
    if (!userToDelete) {
      console.log('❌ User not found:', userEmail);
      console.log('Available users:');
      users.users.forEach(u => {
        console.log(`  - ${u.email}`);
      });
      return false;
    }

    console.log('📋 User to delete:');
    console.log('  Email:', userToDelete.email);
    console.log('  User ID:', userToDelete.id);
    console.log('  Created at:', userToDelete.created_at);
    console.log('');

    // Check and delete user profile
    console.log('🔍 Checking user profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', userToDelete.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.log('❌ Error checking profile:', profileError.message);
    } else if (profile) {
      console.log('✅ User profile found - deleting...');
      const { error: deleteProfileError } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (deleteProfileError) {
        console.log('❌ Failed to delete profile:', deleteProfileError.message);
      } else {
        console.log('✅ User profile deleted');
      }
    } else {
      console.log('ℹ️  No user profile found');
    }

    // Delete the user from auth
    console.log('🔍 Deleting user from auth...');
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
      userToDelete.id
    );

    if (deleteUserError) {
      console.log('❌ Failed to delete user:', deleteUserError.message);
      return false;
    } else {
      console.log('✅ User deleted successfully!');
      return true;
    }

  } catch (err) {
    console.log('❌ Error during deletion:', err.message);
    return false;
  }
}

// Delete all users (except service accounts)
async function deleteAllUsers() {
  console.log('🗑️  Delete All Users\n');
  console.log('⚠️  WARNING: This will delete ALL users!');
  console.log('');

  const env = loadEnvFile();
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing required configuration');
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.log('❌ Could not list users:', listError.message);
      return;
    }

    if (users.users.length === 0) {
      console.log('✅ No users to delete');
      return;
    }

    console.log(`📋 Found ${users.users.length} users to delete:`);
    users.users.forEach(user => {
      console.log(`  - ${user.email}`);
    });
    console.log('');

    let deletedCount = 0;
    let failedCount = 0;

    for (const user of users.users) {
      console.log(`🔍 Deleting ${user.email}...`);
      
      try {
        // Delete profile first
        await supabaseAdmin
          .from('user_profiles')
          .delete()
          .eq('id', user.id);

        // Delete user
        const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        
        if (deleteUserError) {
          console.log(`❌ Failed to delete ${user.email}:`, deleteUserError.message);
          failedCount++;
        } else {
          console.log(`✅ Deleted ${user.email}`);
          deletedCount++;
        }
      } catch (err) {
        console.log(`❌ Error deleting ${user.email}:`, err.message);
        failedCount++;
      }
    }

    console.log('');
    console.log('📊 Deletion Summary:');
    console.log(`✅ Successfully deleted: ${deletedCount} users`);
    console.log(`❌ Failed to delete: ${failedCount} users`);

  } catch (err) {
    console.log('❌ Error:', err.message);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🚀 User Deletion Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node delete-user-flexible.js <email>    # Delete specific user');
    console.log('  node delete-user-flexible.js --all      # Delete all users');
    console.log('');
    console.log('Examples:');
    console.log('  node delete-user-flexible.js jack@qq.com');
    console.log('  node delete-user-flexible.js --all');
    return;
  }

  if (args[0] === '--all') {
    await deleteAllUsers();
  } else {
    const userEmail = args[0];
    const success = await deleteUserByEmail(userEmail);
    
    if (success) {
      console.log(`\n🎉 User ${userEmail} has been successfully deleted!`);
    } else {
      console.log(`\n❌ Failed to delete user ${userEmail}`);
    }
  }
}

// Run the tool
main().catch(console.error);