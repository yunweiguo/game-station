import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'achievements', 'stats', 'notifications'

    if (type === 'achievements') {
      // 获取用户成就
      const { data: userAchievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', session.user.id)

      if (achievementsError) {
        return NextResponse.json({ error: achievementsError.message }, { status: 500 })
      }

      // 获取所有成就（用于显示进度）
      const { data: allAchievements, error: allError } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true })

      if (allError) {
        return NextResponse.json({ error: allError.message }, { status: 500 })
      }

      // 合并数据，显示所有成就及其解锁状态
      const achievementsWithProgress = allAchievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id)
        return {
          ...achievement,
          unlocked: !!userAchievement,
          progress: userAchievement?.progress || 0,
          unlockedAt: userAchievement?.unlocked_at || null
        }
      })

      return NextResponse.json(achievementsWithProgress)
    }

    if (type === 'stats') {
      // 获取用户统计
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = not found
        return NextResponse.json({ error: statsError.message }, { status: 500 })
      }

      // 如果没有统计记录，返回默认值
      if (!stats) {
        return NextResponse.json({
          total_play_time: 0,
          total_games_played: 0,
          total_play_count: 0,
          current_streak: 0,
          best_streak: 0,
          longest_session: 0,
          last_played_at: null
        })
      }

      return NextResponse.json(stats)
    }

    if (type === 'notifications') {
      // 获取成就通知
      const { data: notifications, error: notificationsError } = await supabase
        .from('achievement_notifications')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (notificationsError) {
        return NextResponse.json({ error: notificationsError.message }, { status: 500 })
      }

      return NextResponse.json(notifications)
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
  } catch (error) {
    console.error('Error fetching user achievements:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, notificationId } = await request.json()

    if (action === 'mark_notification_read') {
      // 标记通知为已读
      const { error } = await supabase
        .from('achievement_notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', session.user.id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    if (action === 'mark_all_notifications_read') {
      // 标记所有通知为已读
      const { error } = await supabase
        .from('achievement_notifications')
        .update({ read: true })
        .eq('user_id', session.user.id)
        .eq('read', false)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error('Error updating user achievements:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}