-- Game Station 数据库完全重置脚本
-- ⚠️ 警告：此脚本会删除所有数据，请谨慎执行！

-- ============================================================================
-- 1. 删除触发器
-- ============================================================================

-- 删除用户相关触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS handle_user_game_history_updated_at ON user_game_history;

-- 删除游戏相关触发器
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
DROP TRIGGER IF EXISTS update_games_updated_at ON games;
DROP TRIGGER IF EXISTS update_game_stats_updated_at ON game_stats;

-- 删除社交功能触发器
DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS update_ratings_updated_at ON ratings;
DROP TRIGGER IF EXISTS update_favorites_updated_at ON favorites;

-- 删除成就系统触发器
DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
DROP TRIGGER IF EXISTS update_user_achievements_updated_at ON user_achievements;
DROP TRIGGER IF EXISTS update_notifications_updated_at ON notifications;

-- 删除管理功能触发器
DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;

-- ============================================================================
-- 2. 删除函数
-- ============================================================================

DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS ensure_user_profile();
DROP FUNCTION IF EXISTS handle_game_history_updated_at();
DROP FUNCTION IF EXISTS upsert_game_history();

-- ============================================================================
-- 3. 删除 RLS 策略
-- ============================================================================

-- 用户表策略
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- 游戏表策略
DROP POLICY IF EXISTS "Everyone can view active games" ON games;
DROP POLICY IF EXISTS "Admins can manage games" ON games;

-- 分类表策略
DROP POLICY IF EXISTS "Everyone can view active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

-- 社交功能策略
DROP POLICY IF EXISTS "Everyone can view active comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Admins can manage comments" ON comments;

DROP POLICY IF EXISTS "Everyone can view ratings" ON ratings;
DROP POLICY IF EXISTS "Users can create ratings" ON ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON ratings;

DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;

-- 游戏历史策略
DROP POLICY IF EXISTS "Users can view own game history" ON user_game_history;
DROP POLICY IF EXISTS "Users can insert own game history" ON user_game_history;
DROP POLICY IF EXISTS "Users can update own game history" ON user_game_history;
DROP POLICY IF EXISTS "Users can delete own game history" ON user_game_history;

-- 成就系统策略
DROP POLICY IF EXISTS "Everyone can view active achievements" ON achievements;
DROP POLICY IF EXISTS "Admins can manage achievements" ON achievements;

DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON user_achievements;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;

-- 管理功能策略
DROP POLICY IF EXISTS "Users can create reports" ON reports;
DROP POLICY IF EXISTS "Users can view own reports" ON reports;
DROP POLICY IF EXISTS "Admins can manage reports" ON reports;

-- ============================================================================
-- 4. 删除表（按依赖关系顺序）
-- ============================================================================

-- 删除管理功能表
DROP TABLE IF EXISTS reports CASCADE;

-- 删除成就系统表
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS achievement_notifications CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;

-- 删除社交功能表
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS comments CASCADE;

-- 删除游戏系统表
DROP TABLE IF EXISTS game_stats CASCADE;
DROP TABLE IF EXISTS user_game_history CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 删除其他历史记录表
DROP TABLE IF EXISTS play_history CASCADE;
DROP TABLE IF EXISTS game_reviews CASCADE;

-- 删除用户表
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================================================
-- 5. 清理 auth.users 表中的测试用户（可选）
-- ============================================================================

-- ⚠️ 譨告：以下操作会删除所有用户数据，请谨慎执行！
-- 如果您想保留用户账户，请注释掉以下部分

-- 删除所有用户（除了超级管理员）
-- DELETE FROM auth.users 
-- WHERE email NOT IN ('your-admin-email@example.com');

-- 或者删除特定用户
-- DELETE FROM auth.users WHERE email = 'test@example.com';

-- ============================================================================
-- 6. 重置序列（如果需要）
-- ============================================================================

-- 重置所有序列的计数器
-- SELECT setval(pg_get_serial_sequence('user_profiles', 'id'), 1, false);

-- ============================================================================
-- 7. 验证删除结果
-- ============================================================================

-- 检查是否还有残留的表
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
AND table_name NOT IN (
    'schema_migrations', 
    'net_http_requests', 
    'net_http_request_headers',
    'net_http_response_headers',
    'storage_buckets',
    'storage_objects',
    '_realtime',
    '_realtime_token',
    'pgsodium_masks',
    'pgsodium_validkey',
    'secrets',
    'vaults',
    'vault_decryption_keys',
    'vault_items',
    'vault_secrets'
)
ORDER BY table_name;

-- 检查是否还有残留的函数
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
AND routine_name NOT LIKE 'pgsodium%'
AND routine_name NOT LIKE 'vault%'
AND routine_name NOT LIKE 'extensions%'
ORDER BY routine_name;

-- 检查是否还有残留的触发器
SELECT trigger_name 
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- ============================================================================
-- 重置完成提示
-- ============================================================================

SELECT '数据库重置完成！' as status, 
       '现在可以运行 database-complete-init.sql 来重新初始化数据库' as next_step;