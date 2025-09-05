import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, action } = body;

    if (!gameId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'play') {
      // 先获取当前播放次数
      const { data: currentGame, error: fetchError } = await supabase
        .from('games')
        .select('play_count')
        .eq('id', gameId)
        .single();

      if (fetchError) {
        console.error('Error fetching game:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch game' },
          { status: 500 }
        );
      }

      // 增加游戏播放次数
      const { error } = await supabase
        .from('games')
        .update({ 
          play_count: (currentGame.play_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) {
        console.error('Error updating play count:', error);
        return NextResponse.json(
          { error: 'Failed to update play count' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Game stats updated successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}