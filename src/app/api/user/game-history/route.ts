import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth';

// 获取用户游戏历史记录
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取用户游戏历史记录
    const { data: history, error } = await supabase
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

    if (error) {
      console.error('Error fetching game history:', error);
      return NextResponse.json({ error: 'Failed to fetch game history' }, { status: 500 });
    }

    // 获取总数
    const { count, error: countError } = await supabase
      .from('user_game_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    if (countError) {
      console.error('Error counting game history:', countError);
      return NextResponse.json({ error: 'Failed to count game history' }, { status: 500 });
    }

    // 计算统计数据
    const { data: stats, error: statsError } = await supabase
      .from('user_game_history')
      .select('play_duration, session_count')
      .eq('user_id', session.user.id);

    let totalPlayTime = 0;
    let totalSessions = 0;

    if (stats && !statsError) {
      totalPlayTime = stats.reduce((sum, item) => sum + (item.play_duration || 0), 0);
      totalSessions = stats.reduce((sum, item) => sum + (item.session_count || 0), 0);
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
    const session = await getServerSession(authConfig);
    
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

    // 使用数据库函数更新游戏历史记录
    const { error } = await supabase.rpc('upsert_game_history', {
      p_user_id: session.user.id,
      p_game_id: gameId,
      p_play_duration: playDuration
    });

    if (error) {
      console.error('Error updating game history:', error);
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
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_game_history')
      .delete()
      .eq('user_id', session.user.id)
      .eq('game_id', gameId);

    if (error) {
      console.error('Error deleting game history:', error);
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
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === 'clear_all') {
      const { error } = await supabase
        .from('user_game_history')
        .delete()
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error clearing game history:', error);
        return NextResponse.json({ error: 'Failed to clear game history' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Unexpected error in game history API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}