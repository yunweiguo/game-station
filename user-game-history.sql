-- 用户游戏历史记录表
CREATE TABLE user_game_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
    play_duration INTEGER DEFAULT 0, -- 游戏时长（秒）
    session_count INTEGER DEFAULT 1, -- 游戏次数
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    first_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- 确保每个用户对每个游戏只有一条记录
    UNIQUE(user_id, game_id)
);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_game_history_user_id ON user_game_history(user_id);
CREATE INDEX idx_user_game_history_game_id ON user_game_history(game_id);
CREATE INDEX idx_user_game_history_last_played_at ON user_game_history(last_played_at DESC);
CREATE INDEX idx_user_game_history_user_last_played ON user_game_history(user_id, last_played_at DESC);

-- 启用行级安全策略
ALTER TABLE user_game_history ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的游戏历史记录
CREATE POLICY "Users can view own game history" ON user_game_history
    FOR SELECT USING (auth.uid() = user_id);

-- 用户可以插入自己的游戏历史记录
CREATE POLICY "Users can insert own game history" ON user_game_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户可以更新自己的游戏历史记录
CREATE POLICY "Users can update own game history" ON user_game_history
    FOR UPDATE USING (auth.uid() = user_id);

-- 用户可以删除自己的游戏历史记录
CREATE POLICY "Users can delete own game history" ON user_game_history
    FOR DELETE USING (auth.uid() = user_id);

-- 创建触发器函数，自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
CREATE TRIGGER handle_user_game_history_updated_at
    BEFORE UPDATE ON user_game_history
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 创建函数用于更新或插入游戏历史记录
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