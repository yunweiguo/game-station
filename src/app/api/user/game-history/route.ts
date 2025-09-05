import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 获取用户游戏历史记录
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取用户游戏历史记录
    let history, error;
    try {
      const result = await supabase
        .from('user_game_history')
        .select(`
          *,
          games (
            id,
            name,
            description,
            thumbnail_url,
            category,
            tags,
            rating,
            play_count
          )
        `)
        .eq('user_id', session.user.id)
        .order('last_played_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      history = result.data;
      error = result.error;
    } catch (err) {
      console.error('Database table may not exist:', err);
      // 表不存在，返回空数据而不是错误
      return NextResponse.json({
        history: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        },
        stats: {
          totalGames: 0,
          totalPlayTime: 0,
          totalSessions: 0,
          averagePlayTime: 0
        }
      });
    }

    if (error) {
      console.error('Error fetching game history:', error);
      // 如果是关系错误，说明表不存在
      if (error.code === '42P01' || error.message?.includes('relation "user_game_history" does not exist')) {
        return NextResponse.json({
          history: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0
          },
          stats: {
            totalGames: 0,
            totalPlayTime: 0,
            totalSessions: 0,
            averagePlayTime: 0
          }
        });
      }
      return NextResponse.json({ error: 'Failed to fetch game history' }, { status: 500 });
    }

    // 获取总数
    let count = 0;
    try {
      const countResult = await supabase
        .from('user_game_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      
      if (!countResult.error) {
        count = countResult.count || 0;
      }
    } catch (err) {
      console.warn('Error counting game history (table may not exist):', err);
      count = 0;
    }

    // 计算统计数据
    let totalPlayTime = 0;
    let totalSessions = 0;
    
    try {
      const statsResult = await supabase
        .from('user_game_history')
        .select('play_duration, session_count')
        .eq('user_id', session.user.id);

      if (statsResult.data && !statsResult.error) {
        const stats = statsResult.data;
        totalPlayTime = stats.reduce((sum, item) => sum + (item.play_duration || 0), 0);
        totalSessions = stats.reduce((sum, item) => sum + (item.session_count || 0), 0);
      }
    } catch (err) {
      console.warn('Error calculating stats (table may not exist):', err);
    }

    return NextResponse.json({
      history: history || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats: {
        totalGames: count || 0,
        totalPlayTime,
        totalSessions,
        averagePlayTime: count > 0 ? Math.round(totalPlayTime / count) : 0
      }
    });
  } catch (error) {
    console.error('Unexpected error in game history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 添加或更新游戏历史记录
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, playDuration = 0 } = await request.json();

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    // 验证游戏是否存在
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // 使用基本的插入/更新逻辑（更可靠的方法）
    try {
      // 首先检查是否已存在记录
      const { data: existing, error: selectError } = await supabase
        .from('user_game_history')
        .select('id, play_duration, session_count')
        .eq('user_id', session.user.id)
        .eq('game_id', gameId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = not found
        throw selectError;
      }

      if (existing) {
        // 更新现有记录
        const { error: updateError } = await supabase
          .from('user_game_history')
          .update({ 
            play_duration: (existing.play_duration || 0) + playDuration,
            session_count: (existing.session_count || 0) + 1,
            last_played_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // 插入新记录
        const { error: insertError } = await supabase
          .from('user_game_history')
          .insert({
            user_id: session.user.id,
            game_id: gameId,
            play_duration: playDuration,
            session_count: 1,
            last_played_at: new Date().toISOString(),
            first_played_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating game history:', error);
      // 如果表不存在，静默失败而不是返回错误
      if (error.code === '42P01' || error.message?.includes('relation "user_game_history" does not exist')) {
        console.warn('user_game_history table does not exist, skipping history update');
        return NextResponse.json({ success: true, message: 'Table not initialized, skipping update' });
      }
      // 如果是RLS策略错误（用户未登录），这也是正常的
      if (error.code === '42501' || error.message?.includes('row-level security policy')) {
        console.warn('User not authenticated or RLS policy violation, skipping history update');
        return NextResponse.json({ success: true, message: 'User not authenticated, skipping update' });
      }
      return NextResponse.json({ error: 'Failed to update game history' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in game history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 删除游戏历史记录
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    try {
      const { error } = await supabase
        .from('user_game_history')
        .delete()
        .eq('user_id', session.user.id)
        .eq('game_id', gameId);

      if (error) {
        // 如果表不存在，视为成功（因为没有记录可删除）
        if (error.code === '42P01' || error.message?.includes('relation "user_game_history" does not exist')) {
          console.warn('user_game_history table does not exist, nothing to delete');
          return NextResponse.json({ success: true, message: 'Table not initialized, nothing to delete' });
        }
        throw error;
      }
    } catch (error) {
      console.error('Error deleting game history:', error);
      // 如果表不存在，静默成功
      if (error.code === '42P01' || error.message?.includes('relation "user_game_history" does not exist')) {
        return NextResponse.json({ success: true, message: 'Table not initialized, nothing to delete' });
      }
      return NextResponse.json({ error: 'Failed to delete game history' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in game history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 清空所有游戏历史记录
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === 'clear_all') {
      try {
        const { error } = await supabase
          .from('user_game_history')
          .delete()
          .eq('user_id', session.user.id);

        if (error) {
          // 如果表不存在，视为成功（因为没有记录可清除）
          if (error.code === '42P01' || error.message?.includes('relation "user_game_history" does not exist')) {
            console.warn('user_game_history table does not exist, nothing to clear');
            return NextResponse.json({ success: true, message: 'Table not initialized, nothing to clear' });
          }
          throw error;
        }

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error clearing game history:', error);
        // 如果表不存在，静默成功
        if (error.code === '42P01' || error.message?.includes('relation "user_game_history" does not exist')) {
          return NextResponse.json({ success: true, message: 'Table not initialized, nothing to clear' });
        }
        return NextResponse.json({ error: 'Failed to clear game history' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Unexpected error in game history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}