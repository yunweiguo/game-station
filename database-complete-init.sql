-- Game Station Complete Database Initialization Script
-- Please execute these statements in order in Supabase SQL Editor

-- ============================================================================
-- 1. User Related Tables
-- ============================================================================

-- User profiles table
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

-- ============================================================================
-- 2. Game Related Tables
-- ============================================================================

-- Game categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    thumbnail TEXT,
    url TEXT NOT NULL,
    iframe_url TEXT,
    tags TEXT[], -- Array type tags
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    play_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game statistics table
CREATE TABLE IF NOT EXISTS game_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    play_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    last_played_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_id)
);

-- User game history table
CREATE TABLE IF NOT EXISTS user_game_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    play_duration INTEGER DEFAULT 0, -- Play duration in seconds
    session_count INTEGER DEFAULT 1, -- Play sessions count
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    first_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Ensure each user has only one record per game
    UNIQUE(user_id, game_id)
);

-- ============================================================================
-- 3. Social Features Tables
-- ============================================================================

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Support replies
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- ============================================================================
-- 4. Achievement System Tables
-- ============================================================================

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon TEXT,
    color VARCHAR(7) DEFAULT '#F59E0B',
    type VARCHAR(50) DEFAULT 'game' CHECK (type IN ('game', 'social', 'system')),
    requirement JSON NOT NULL, -- Store achievement requirements, such as {"play_time": 3600, "games_played": 10}
    points INTEGER DEFAULT 10,
    sort_order INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    progress JSON DEFAULT '{}', -- Store progress data
    unlocked_at TIMESTAMP WITH TIME ZONE,
    notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- User statistics table
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    total_play_time INTEGER DEFAULT 0, -- Total play time (seconds)
    total_games_played INTEGER DEFAULT 0, -- Total games played
    total_play_count INTEGER DEFAULT 0, -- Total play sessions
    favorite_category_id UUID REFERENCES categories(id),
    longest_session INTEGER DEFAULT 0, -- Longest play session (seconds)
    current_streak INTEGER DEFAULT 0, -- Current consecutive play days
    best_streak INTEGER DEFAULT 0, -- Best consecutive play days
    last_played_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Achievement notifications table
CREATE TABLE IF NOT EXISTS achievement_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('achievement', 'system', 'social')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON DEFAULT '{}', -- Additional data
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. Management Features Tables
-- ============================================================================

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 6. Create Indexes for Query Performance
-- ============================================================================

-- User related indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- Game history indexes
CREATE INDEX IF NOT EXISTS idx_user_game_history_user_id ON user_game_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_history_game_id ON user_game_history(game_id);
CREATE INDEX IF NOT EXISTS idx_user_game_history_last_played_at ON user_game_history(last_played_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_game_history_user_last_played ON user_game_history(user_id, last_played_at DESC);

-- Game related indexes
CREATE INDEX IF NOT EXISTS idx_games_category_id ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured);
CREATE INDEX IF NOT EXISTS idx_games_rating ON games(rating DESC);
CREATE INDEX IF NOT EXISTS idx_games_play_count ON games(play_count DESC);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

-- Category indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Social features indexes
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_game_id ON ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_ratings_score ON ratings(score);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_game_id ON favorites(game_id);

-- Achievement system indexes
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(type);
CREATE INDEX IF NOT EXISTS idx_achievements_status ON achievements(status);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- User statistics table indexes
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_favorite_category_id ON user_stats(favorite_category_id);

-- Achievement notifications table indexes
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_user_id ON achievement_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_achievement_id ON achievement_notifications(achievement_id);
CREATE INDEX IF NOT EXISTS idx_achievement_notifications_read ON achievement_notifications(read);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- Management features indexes
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_game_id ON reports(game_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE INDEX IF NOT EXISTS idx_game_stats_game_id ON game_stats(game_id);

-- ============================================================================
-- 7. Enable Row Level Security (RLS)
-- ============================================================================

-- User profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage all profiles" ON user_profiles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Games table
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active games" ON games FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage games" ON games FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active categories" ON categories FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active comments" ON comments FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage comments" ON comments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Ratings table
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view ratings" ON ratings FOR SELECT;
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = user_id);

-- Favorites table
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Game history table
ALTER TABLE user_game_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own game history" ON user_game_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own game history" ON user_game_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own game history" ON user_game_history FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own game history" ON user_game_history FOR DELETE USING (auth.uid() = user_id);

-- Achievements table
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active achievements" ON achievements FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- User achievements table
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON user_achievements FOR UPDATE USING (auth.uid() = user_id);

-- User statistics table
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create stats" ON user_stats FOR INSERT WITH CHECK (true);

-- Achievement notifications table
ALTER TABLE achievement_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON achievement_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON achievement_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON achievement_notifications FOR INSERT WITH CHECK (true);

-- Notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reports table
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage reports" ON reports FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- 8. Create Trigger Functions
-- ============================================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create user profile records
CREATE OR REPLACE FUNCTION ensure_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, username, email, role, status)
    SELECT 
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
        NEW.email,
        CASE WHEN NEW.email = 'admin@gamestation.com' THEN 'admin' ELSE 'user' END,
        'active'
    WHERE NOT EXISTS (
        SELECT 1 FROM user_profiles WHERE id = NEW.id
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        email = EXCLUDED.email,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Game history updated at trigger function
CREATE OR REPLACE FUNCTION handle_game_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Game history upsert function
CREATE OR REPLACE FUNCTION upsert_game_history(
    p_user_id UUID,
    p_game_id UUID,
    p_play_duration INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_game_history (user_id, game_id, play_duration, session_count, last_played_at, first_played_at)
    VALUES (p_user_id, p_game_id, p_play_duration, 1, NOW(), NOW())
    ON CONFLICT (user_id, game_id) 
    DO UPDATE SET
        play_duration = user_game_history.play_duration + p_play_duration,
        session_count = user_game_history.session_count + 1,
        last_played_at = NOW(),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. Create Triggers
-- ============================================================================

-- Updated at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at BEFORE UPDATE ON user_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at BEFORE UPDATE ON game_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Game history trigger
CREATE TRIGGER handle_user_game_history_updated_at
    BEFORE UPDATE ON user_game_history
    FOR EACH ROW
    EXECUTE FUNCTION handle_game_history_updated_at();

-- Automatically create profile when user registers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_user_profile();

-- ============================================================================
-- 10. Insert Default Data
-- ============================================================================

-- Create default categories
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('Action Games', 'action', 'Fast-paced action games featuring combat, shooting and more', '#EF4444', '🎮', 1),
('Puzzle Games', 'puzzle', 'Mind-training puzzle games including problem-solving and strategy', '#10B981', '🧩', 2),
('Casual Games', 'casual', 'Relaxing and enjoyable casual games suitable for all ages', '#F59E0B', '😊', 3),
('Strategy Games', 'strategy', 'Games requiring strategic thinking and intelligence', '#8B5CF6', '🎯', 4),
('Sports Games', 'sports', 'Sports games featuring various athletic competitions', '#06B6D4', '⚽', 5),
('Adventure Games', 'adventure', 'Adventure games exploring the unknown with rich storylines', '#F97316', '🗺️', 6),
('Shooting Games', 'shooting', 'First-person/third-person shooting games', '#DC2626', '🔫', 7),
('Racing Games', 'racing', 'High-speed racing games full of excitement', '#EA580C', '🏎️', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- Create sample game data
INSERT INTO games (title, slug, description, category_id, thumbnail, url, iframe_url, tags, difficulty, rating, featured, status) VALUES
(
    '2048', 
    '2048', 
    'Classic number merging game, reach 2048 by combining identical numbers!', 
    (SELECT id FROM categories WHERE slug = 'puzzle'),
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    'https://play2048.co',
    'https://play2048.co',
    ARRAY['Puzzle', 'Numbers', 'Strategy'],
    'easy',
    4.5,
    true,
    'active'
),
(
    'Flappy Bird', 
    'flappy-bird', 
    'Classic bird flying game, tap the screen to make the bird fly and avoid pipes!', 
    (SELECT id FROM categories WHERE slug = 'action'),
    'https://images.unsplash.com/photo-1554435264-45cf4372f008?w=400&h=300&fit=crop',
    'https://flappybird.io',
    'https://flappybird.io',
    ARRAY['Action', 'Casual', 'Flying'],
    'medium',
    4.2,
    true,
    'active'
),
(
    'Snake', 
    'snake', 
    'Classic snake game, control the snake to eat food and grow while avoiding hitting yourself!', 
    (SELECT id FROM categories WHERE slug = 'action'),
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop',
    'https://snake.google',
    'https://snake.google',
    ARRAY['Classic', 'Action', 'Strategy'],
    'medium',
    4.3,
    false,
    'active'
),
(
    'Tetris', 
    'tetris', 
    'Classic block elimination game, arrange falling blocks to clear complete lines!', 
    (SELECT id FROM categories WHERE slug = 'puzzle'),
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    'https://tetris.com',
    'https://tetris.com/play-tetris',
    ARRAY['Puzzle', 'Classic', 'Strategy'],
    'medium',
    4.6,
    true,
    'active'
),
(
    'Basketball Shooting', 
    'basketball', 
    'Basketball shooting simulation game, test your shooting skills and timing!', 
    (SELECT id FROM categories WHERE slug = 'sports'),
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    'https://basketballlegends.fun',
    'https://basketballlegends.fun',
    ARRAY['Sports', 'Shooting', 'Competition'],
    'medium',
    4.1,
    false,
    'active'
),
(
    'Extreme Racing', 
    'racing', 
    'High-speed racing game, speed through city streets and avoid other vehicles!', 
    (SELECT id FROM categories WHERE slug = 'racing'),
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://madalin-stunt-cars.com',
    'https://madalin-stunt-cars.com',
    ARRAY['Racing', 'Speed', 'Competition'],
    'hard',
    4.4,
    true,
    'active'
),
(
    'Super Mario', 
    'super-mario', 
    'Classic platform jumping game, help Mario save Princess Peach!', 
    (SELECT id FROM categories WHERE slug = 'adventure'),
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    'https://supermario-game.com',
    'https://supermario-game.com',
    ARRAY['Classic', 'Adventure', 'Platform'],
    'medium',
    4.7,
    true,
    'active'
),
(
    'Zombie Shooter', 
    'zombie-shooter', 
    'First-person zombie shooting game, survive in the city and eliminate zombies!', 
    (SELECT id FROM categories WHERE slug = 'shooting'),
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    'https://zombie-shooting.games',
    'https://zombie-shooting.games',
    ARRAY['Shooting', 'Zombie', 'Survival'],
    'hard',
    4.0,
    false,
    'active'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  thumbnail = EXCLUDED.thumbnail,
  url = EXCLUDED.url,
  iframe_url = EXCLUDED.iframe_url,
  tags = EXCLUDED.tags,
  difficulty = EXCLUDED.difficulty,
  rating = EXCLUDED.rating,
  featured = EXCLUDED.featured,
  status = EXCLUDED.status;

-- Create game statistics records
INSERT INTO game_stats (game_id, play_count, view_count, favorite_count, comment_count, rating_count, average_rating)
SELECT 
    g.id,
    FLOOR(RANDOM() * 10000)::integer as play_count,
    FLOOR(RANDOM() * 15000)::integer as view_count,
    FLOOR(RANDOM() * 500)::integer as favorite_count,
    FLOOR(RANDOM() * 200)::integer as comment_count,
    FLOOR(RANDOM() * 300)::integer as rating_count,
    (RANDOM() * 2 + 3)::decimal(3,2) as average_rating
FROM games g
LEFT JOIN game_stats gs ON g.id = gs.game_id
WHERE gs.game_id IS NULL;

-- Create achievement data
INSERT INTO achievements (name, description, icon, type, requirement, points, sort_order) VALUES
('Game Beginner', 'Complete your first game', '🎮', 'game', '{"games_played": 1}', 10, 1),
('Game Master', 'Play 10 different games', '🏆', 'game', '{"games_played": 10}', 50, 2),
('Time Master', 'Accumulate 1 hour of game time', '⏰', 'game', '{"play_time": 3600}', 30, 3),
('Critic', 'Publish 5 game reviews', '💬', 'social', '{"comments_count": 5}', 20, 4),
('Collector', 'Favorite 10 games', '⭐', 'social', '{"favorites_count": 10}', 25, 5),
('Explorer', 'Play games from all categories', '🗺️', 'game', '{"categories_explored": 8}', 100, 6),
('Perfectionist', 'Play the same game more than 10 times', '🎯', 'game', '{"single_game_sessions": 10}', 40, 7),
('Social Butterfly', 'Rate 10 games', '👍', 'social', '{"ratings_count": 10}', 15, 8)
ON CONFLICT DO NOTHING;

-- Create profile records for existing users
INSERT INTO user_profiles (id, username, email, role, status)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'username', 'user_' || substring(id::text, 1, 8)),
    email,
    CASE WHEN email = 'admin@gamestation.com' THEN 'admin' ELSE 'user' END,
    'active'
FROM auth.users 
WHERE NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_profiles.id = auth.users.id
)
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    updated_at = NOW();

-- ============================================================================
-- Initialization Complete
-- ============================================================================

-- Verify Installation
SELECT 
    'User Profiles' as table_name,
    COUNT(*) as record_count 
FROM user_profiles
UNION ALL
SELECT 
    'Games' as table_name,
    COUNT(*) as record_count 
FROM games
UNION ALL
SELECT 
    'Game History' as table_name,
    COUNT(*) as record_count 
FROM user_game_history
UNION ALL
SELECT 
    'Achievements' as table_name,
    COUNT(*) as record_count 
FROM achievements
UNION ALL
SELECT 
    'Categories' as table_name,
    COUNT(*) as record_count 
FROM categories
ORDER BY table_name;