import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // 创建管理员用户档案
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: '8d31df39-fcda-4ace-8f84-6f8709dfeedd',
        username: 'admin',
        email: 'admin@gamestation.com',
        role: 'admin',
        status: 'active',
        email_verified: true,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: 'Failed to create admin profile', details: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Admin profile created successfully',
      data 
    })
  } catch (error) {
    console.error('Error creating admin profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}