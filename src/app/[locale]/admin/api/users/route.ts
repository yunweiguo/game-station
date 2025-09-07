import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface UserWithCount {
  id: string
  username: string
  email: string
  name: string
  avatar: string
  role: string
  status: string
  emailVerified: boolean
  createdAt: Date
  lastActiveAt: Date
  _count: {
    comments: number
    ratings: number
    favorites: number
    reports: number
  }
}

// 获取所有用户
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const status = searchParams.get('status') || 'all'

    const start = (page - 1) * limit
    const end = start + limit - 1

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })

    // 搜索过滤
    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%,name.ilike.%${search}%`)
    }

    // 角色过滤
    if (role !== 'all') {
      query = query.eq('role', role)
    }

    // 状态过滤
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: users, error, count } = await query
      .order('created_at', { ascending: false })
      .range(start, end)

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // 转换数据格式
    const formattedUsers = users.map((user: { 
      id: string; 
      username: string; 
      email: string; 
      name: string; 
      avatar?: string;
      role?: string;
      status?: string;
      email_verified?: boolean;
      created_at: string;
      last_active_at?: string;
      createdAt: Date; 
      updatedAt: Date;
    }) => ({
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
    }))

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, name, role = 'user', status = 'active', emailVerified = false } = body

    if (!username || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 检查用户名和邮箱是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Username or email already exists' }, { status: 400 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        username,
        email,
        name,
        role,
        status,
        email_verified: emailVerified,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}