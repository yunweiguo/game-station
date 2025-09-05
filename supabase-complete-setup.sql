-- Game Station 完整数据库初始化脚本
-- 请在 Supabase SQL Editor 中执行这些语句

-- 1. 用户档案表
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

-- 2. 游戏分类表
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

-- 3. 游戏表（增强版）
CREATE TABLE IF NOT EXISTS games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    thumbnail TEXT,
    url TEXT NOT NULL,
    iframe_url TEXT,
    tags TEXT[], -- 数组类型的标签
    difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    rating DECIMAL(3,2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
    play_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 游戏统计表
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

-- 5. 评论表
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 支持回复
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 评分表
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

-- 7. 收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, game_id)
);

-- 8. 游戏历史记录表
CREATE TABLE IF NOT EXISTS play_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE,
    play_duration INTEGER DEFAULT 0, -- 游戏时长（秒）
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. 举报表
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

-- 创建 RLS 策略
-- 用户档案表
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON user_profiles FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage all profiles" ON user_profiles FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 游戏表
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active games" ON games FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage games" ON games FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 分类表
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active categories" ON categories FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 评论表
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view active comments" ON comments FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage comments" ON comments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 评分表
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view ratings" ON ratings FOR SELECT;
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = user_id);

-- 收藏表
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- 游戏历史表
ALTER TABLE play_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own play history" ON play_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create play history" ON play_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建默认分类
INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('动作游戏', 'action', '快节奏的动作游戏，包含战斗、射击等元素', '#EF4444', '🎮', 1),
('益智游戏', 'puzzle', '锻炼思维的益智游戏，包含解谜、策略等', '#10B981', '🧩', 2),
('休闲游戏', 'casual', '轻松愉快的休闲游戏，适合所有年龄段', '#F59E0B', '😊', 3),
('策略游戏', 'strategy', '需要策略思考的游戏，考验智力', '#8B5CF6', '🎯', 4),
('体育游戏', 'sports', '体育运动类游戏，包含各种竞技项目', '#06B6D4', '⚽', 5),
('冒险游戏', 'adventure', '探索未知的冒险游戏，剧情丰富', '#F97316', '🗺️', 6),
('射击游戏', 'shooting', '第一人称/第三人称射击游戏', '#DC2626', '🔫', 7),
('赛车游戏', 'racing', '速度与激情的赛车游戏', '#EA580C', '🏎️', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- 创建示例游戏数据
INSERT INTO games (title, slug, description, category_id, thumbnail, url, iframe_url, tags, difficulty, rating, featured, status) VALUES
(
    '2048', 
    '2048', 
    '经典的数字合成游戏，通过合并相同数字来达到2048！', 
    (SELECT id FROM categories WHERE slug = 'puzzle'),
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    'https://play2048.co',
    'https://play2048.co',
    ARRAY['益智', '数字', '策略'],
    'easy',
    4.5,
    true,
    'active'
),
(
    'Flappy Bird', 
    'flappy-bird', 
    '经典的小鸟飞行游戏，点击屏幕让小鸟飞翔，避开管道！', 
    (SELECT id FROM categories WHERE slug = 'action'),
    'https://images.unsplash.com/photo-1554435264-45cf4372f008?w=400&h=300&fit=crop',
    'https://flappybird.io',
    'https://flappybird.io',
    ARRAY['动作', '休闲', '飞行'],
    'medium',
    4.2,
    true,
    'active'
),
(
    '贪吃蛇', 
    'snake', 
    '经典的贪吃蛇游戏，控制蛇吃食物并成长，避免撞到自己！', 
    (SELECT id FROM categories WHERE slug = 'action'),
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop',
    'https://snake.google',
    'https://snake.google',
    ARRAY['经典', '动作', '策略'],
    'medium',
    4.3,
    false,
    'active'
),
(
    '俄罗斯方块', 
    'tetris', 
    '经典的方块消除游戏，排列下落的方块来消除整行！', 
    (SELECT id FROM categories WHERE slug = 'puzzle'),
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    'https://tetris.com',
    'https://tetris.com/play-tetris',
    ARRAY['益智', '经典', '策略'],
    'medium',
    4.6,
    true,
    'active'
),
(
    '篮球投篮', 
    'basketball', 
    '模拟篮球投篮的游戏，考验你的投篮技巧和时机把握！', 
    (SELECT id FROM categories WHERE slug = 'sports'),
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
    'https://basketballlegends.fun',
    'https://basketballlegends.fun',
    ARRAY['体育', '投篮', '竞技'],
    'medium',
    4.1,
    false,
    'active'
),
(
    '极速赛车', 
    'racing', 
    '高速赛车游戏，在城市街道上飞驰，避开其他车辆！', 
    (SELECT id FROM categories WHERE slug = 'racing'),
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://madalin-stunt-cars.com',
    'https://madalin-stunt-cars.com',
    ARRAY['赛车', '速度', '竞技'],
    'hard',
    4.4,
    true,
    'active'
),
(
    '超级马里奥', 
    'super-mario', 
    '经典的平台跳跃游戏，帮助马里奥拯救桃子公主！', 
    (SELECT id FROM categories WHERE slug = 'adventure'),
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    'https://supermario-game.com',
    'https://supermario-game.com',
    ARRAY['经典', '冒险', '平台'],
    'medium',
    4.7,
    true,
    'active'
),
(
    '僵尸射击', 
    'zombie-shooter', 
    '第一人称僵尸射击游戏，在城市中生存并消灭僵尸！', 
    (SELECT id FROM categories WHERE slug = 'shooting'),
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    'https://zombie-shooting.games',
    'https://zombie-shooting.games',
    ARRAY['射击', '僵尸', '生存'],
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

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加更新时间触发器
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

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at BEFORE UPDATE ON game_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_games_category_id ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(featured);
CREATE INDEX IF NOT EXISTS idx_games_rating ON games(rating DESC);
CREATE INDEX IF NOT EXISTS idx_games_play_count ON games(play_count DESC);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_game_id ON ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_ratings_score ON ratings(score);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_game_id ON favorites(game_id);

CREATE INDEX IF NOT EXISTS idx_play_history_user_id ON play_history(user_id);
CREATE INDEX IF NOT EXISTS idx_play_history_game_id ON play_history(game_id);

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_game_id ON reports(game_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

CREATE INDEX IF NOT EXISTS idx_game_stats_game_id ON game_stats(game_id);

-- 创建游戏统计记录
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

-- 更新管理员用户档案
INSERT INTO user_profiles (id, username, email, role, status, email_verified)
SELECT 
    id,
    'admin',
    email,
    'admin',
    'active',
    true
FROM auth.users 
WHERE email = 'admin@gamestation.com'
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  email_verified = EXCLUDED.email_verified;