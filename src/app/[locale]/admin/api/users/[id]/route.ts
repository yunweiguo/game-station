import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// 获取单个用户
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 转换数据格式
    const formattedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      emailVerified: user.email_verified,
      joinedAt: new Date(user.created_at).toLocaleDateString('zh-CN'),
      lastActiveAt: user.last_active_at ? new Date(user.last_active_at).toLocaleDateString('zh-CN') : null,
      totalComments: 0, // 暂时设为0，需要从comments表统计
      totalRatings: 0, // 暂时设为0，需要从ratings表统计
      totalFavorites: 0, // 暂时设为0，需要从favorites表统计
      totalReports: 0, // 暂时设为0，需要从reports表统计
      violationScore: 0
    }

    return NextResponse.json(formattedUser)
  } catch (error) {
    console.error('获取用户详情失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 更新用户
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { username, email, name, role, status, emailVerified } = body

    // 检查用户是否存在
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 检查用户名和邮箱是否与其他用户冲突
    if (username && username !== existingUser.username) {
      const { data: conflictUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', id)
        .single()

      if (conflictUser) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
      }
    }

    if (email && email !== existingUser.email) {
      const { data: conflictUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .neq('id', id)
        .single()

      if (conflictUser) {
        return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
      }
    }

    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({
        username: username ?? existingUser.username,
        email: email ?? existingUser.email,
        name: name ?? existingUser.name,
        role: role ?? existingUser.role,
        status: status ?? existingUser.status,
        email_verified: emailVerified ?? existingUser.email_verified,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating user:', updateError)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('更新用户失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 删除用户
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // 检查用户是否存在
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
    }

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 更新用户状态
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body

    // 检查用户是否存在
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let updatedUser

    switch (action) {
      case 'toggleStatus':
        const { data: toggledUser, error: toggleError } = await supabase
          .from('users')
          .update({ 
            status: existingUser.status === 'active' ? 'inactive' : 'active',
            last_active_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (toggleError) {
          console.error('Error toggling user status:', toggleError)
          return NextResponse.json({ error: 'Failed to update user status' }, { status: 500 })
        }
        updatedUser = toggledUser
        break
      case 'ban':
        const { data: bannedUser, error: banError } = await supabase
          .from('users')
          .update({ 
            status: 'banned',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (banError) {
          console.error('Error banning user:', banError)
          return NextResponse.json({ error: 'Failed to ban user' }, { status: 500 })
        }
        updatedUser = bannedUser
        break
      case 'unban':
        const { data: unbannedUser, error: unbanError } = await supabase
          .from('users')
          .update({ 
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (unbanError) {
          console.error('Error unbanning user:', unbanError)
          return NextResponse.json({ error: 'Failed to unban user' }, { status: 500 })
        }
        updatedUser = unbannedUser
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('更新用户状态失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}