import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // 获取总游戏数
    const { count: totalGames } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })

    // 获取总用户数
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 获取最近添加的游戏
    const { data: recentGames } = await supabase
      .from('games')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // 获取新注册用户
    const { data: recentUsers } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // 获取真实的总游戏次数
    const { data: gamesPlayCount } = await supabase
      .from('games')
      .select('play_count')

    const totalPlays = gamesPlayCount?.reduce((sum, game) => sum + (game.play_count || 0), 0) || 0

    // 暂时将总浏览量设为总游戏次数的80%（估算）
    const totalViews = Math.floor(totalPlays * 0.8)

    // 获取真实的总评分数
    const { count: totalRatings } = await supabase
      .from('ratings')
      .select('*', { count: 'exact', head: true })

    // 获取最近游戏的详细统计信息
    const { data: recentGamesWithStats } = await supabase
      .from('games')
      .select('id, name, rating, play_count, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      totalGames: totalGames || 0,
      totalUsers: totalUsers || 0,
      totalViews,
      totalPlays,
      totalRatings: totalRatings || 0,
      recentGames: recentGamesWithStats?.map(game => ({
        id: game.id,
        title: game.name,
        views: Math.floor((game.play_count || 0) * 0.8), // 估算浏览量
        rating: game.rating || 0,
        playCount: game.play_count || 0
      })) || [],
      recentUsers: recentUsers?.map(user => ({
        id: user.id,
        name: user.name || '未命名用户',
        email: user.email,
        joinedAt: new Date(user.created_at).toLocaleDateString('zh-CN')
      })) || []
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}