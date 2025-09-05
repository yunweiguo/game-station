-- User Achievement System Database Schema

-- 1. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT '🏆',
    color VARCHAR(7) DEFAULT '#FFD700',
    points INTEGER DEFAULT 10,
    category VARCHAR(100) DEFAULT 'general',
    requirement_type VARCHAR(50) NOT NULL, -- 'play_count', 'time_spent', 'games_played', 'category_master', etc.
    requirement_value INTEGER NOT NULL,
    hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Achievements Table
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0, -- Progress tracking
    notified BOOLEAN DEFAULT false, -- Whether notified
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 3. User Statistics Table
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    total_play_time INTEGER DEFAULT 0, -- Total play time (seconds)
    total_games_played INTEGER DEFAULT 0, -- Total games played
    total_play_count INTEGER DEFAULT 0, -- Total play count
    favorite_category_id UUID REFERENCES categories(id),
    longest_session INTEGER DEFAULT 0, -- Longest session (seconds)
    current_streak INTEGER DEFAULT 0, -- Current consecutive days
    best_streak INTEGER DEFAULT 0, -- Best consecutive days
    last_played_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 4. Achievement Notifications Table
CREATE TABLE IF NOT EXISTS achievement_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Admins can manage achievements" ON achievements FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create achievements" ON user_achievements FOR INSERT WITH CHECK (true);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create stats" ON user_stats FOR INSERT WITH CHECK (true);

ALTER TABLE achievement_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON achievement_notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON achievement_notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON achievement_notifications FOR INSERT WITH CHECK (true);

-- Create default achievement data
INSERT INTO achievements (name, slug, description, icon, points, category, requirement_type, requirement_value, hidden) VALUES
('Game Beginner', 'first-game', 'Complete your first game', '🎮', 10, 'general', 'games_played', 1, false),
('Game Master', 'game-master', 'Complete 100 games', '👑', 100, 'general', 'games_played', 100, false),
('Time Master', 'time-master', 'Accumulate 10 hours of play time', '⏰', 50, 'time', 'play_time', 36000, false),
('Dedicated Player', 'dedicated-player', 'Play games for 7 consecutive days', '🔥', 30, 'streak', 'consecutive_days', 7, false),
('Collector', 'collector', 'Favorite 20 games', '⭐', 40, 'collection', 'favorites', 20, false),
('Category Expert', 'category-expert', 'Complete 50 games in any category', '🎯', 60, 'category', 'category_master', 50, false),
('Marathon Gamer', 'marathon-gamer', 'Play for more than 2 hours in a single session', '🏃', 35, 'time', 'long_session', 7200, false),
('Active Player', 'active-player', 'Reach 1000 total plays', '🚀', 80, 'general', 'play_count', 1000, false),
('Explorer', 'explorer', 'Try 10 different game categories', '🗺️', 45, 'discovery', 'categories_explored', 10, false),
('Legendary Player', 'legendary-player', 'Accumulate 100 hours of play time', '💎', 200, 'time', 'play_time', 360000, false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  points = EXCLUDED.points,
  category = EXCLUDED.category,
  requirement_type = EXCLUDED.requirement_type,
  requirement_value = EXCLUDED.requirement_value,
  hidden = EXCLUDED.hidden;

-- Create function: Update user statistics and check achievements
CREATE OR REPLACE FUNCTION update_user_stats_and_achievements()
RETURNS TRIGGER AS $$
DECLARE
    user_stat RECORD;
    achievement RECORD;
    new_progress INTEGER;
    should_unlock BOOLEAN;
BEGIN
    -- Update user statistics
    INSERT INTO user_stats (user_id, total_play_count, last_played_at, updated_at)
    VALUES (NEW.user_id, 1, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        total_play_count = user_stats.total_play_count + 1,
        last_played_at = NOW(),
        updated_at = NOW();

    -- Get updated user statistics
    SELECT * INTO user_stat FROM user_stats WHERE user_id = NEW.user_id;

    -- Check various achievement conditions
    FOR achievement IN SELECT * FROM achievements WHERE hidden = false LOOP
        -- Check if already unlocked
        SELECT progress INTO new_progress FROM user_achievements 
        WHERE user_id = NEW.user_id AND achievement_id = achievement.id;
        
        IF new_progress IS NULL THEN
            new_progress := 0;
        END IF;

        should_unlock := false;

        -- Check conditions based on achievement type
        CASE achievement.requirement_type
            WHEN 'games_played' THEN
                new_progress := user_stat.total_games_played;
                should_unlock := new_progress >= achievement.requirement_value;
            WHEN 'play_count' THEN
                new_progress := user_stat.total_play_count;
                should_unlock := new_progress >= achievement.requirement_value;
            WHEN 'play_time' THEN
                new_progress := user_stat.total_play_time;
                should_unlock := new_progress >= achievement.requirement_value;
            WHEN 'favorites' THEN
                SELECT COALESCE(COUNT(*), 0) INTO new_progress 
                FROM user_profiles WHERE id = NEW.user_id;
                should_unlock := new_progress >= achievement.requirement_value;
            -- Other achievement types can be added here
        END CASE;

        -- Update or create achievement record
        IF should_unlock AND new_progress >= achievement.requirement_value THEN
            INSERT INTO user_achievements (user_id, achievement_id, progress, unlocked_at)
            VALUES (NEW.user_id, achievement.id, new_progress, NOW())
            ON CONFLICT (user_id, achievement_id) DO UPDATE SET
                progress = new_progress,
                unlocked_at = CASE 
                    WHEN user_achievements.unlocked_at IS NULL THEN NOW()
                    ELSE user_achievements.unlocked_at
                END;

            -- Create notification
            INSERT INTO achievement_notifications (user_id, achievement_id, message)
            VALUES (NEW.user_id, achievement.id, 
                   'Congratulations! You unlocked the achievement: ' || achievement.name || '! ' || achievement.description);
        ELSIF new_progress > 0 THEN
            -- Update progress
            INSERT INTO user_achievements (user_id, achievement_id, progress)
            VALUES (NEW.user_id, achievement.id, new_progress)
            ON CONFLICT (user_id, achievement_id) DO UPDATE SET
                progress = new_progress;
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger: Update statistics and achievements when play history is created
CREATE TRIGGER on_play_history_created
    AFTER INSERT ON play_history
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats_and_achievements();