import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 创建管理员账户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@gamestation.com',
      password: 'admin123456',
    })

    if (authError) {
      return NextResponse.json({ error: '创建认证用户失败', details: authError.message }, { status: 400 })
    }

    if (authData.user?.id) {
      // 创建用户档案
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: authData.user.id,
          username: 'admin',
          email: 'admin@gamestation.com',
          role: 'admin',
          avatar: null,
          status: 'active',
          email_verified: true,
        })
        .select()

      if (profileError) {
        return NextResponse.json({ error: '创建用户档案失败', details: profileError.message }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        message: '管理员账户创建成功',
        user: {
          email: 'admin@gamestation.com',
          password: 'admin123456',
          role: 'admin'
        }
      })
    }

    return NextResponse.json({ error: '创建用户失败' }, { status: 400 })

  } catch (error) {
    console.error('创建管理员账户错误:', error)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}