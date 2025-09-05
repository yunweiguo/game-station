import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取所有分类
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    let query = supabase
      .from('categories')
      .select('*', { count: 'exact' })

    // 搜索过滤
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    // 获取每个分类的游戏数量
    const categoriesWithCount = await Promise.all(
      (data || []).map(async (category) => {
        const { count: gameCount } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'active')

        return {
          ...category,
          game_count: gameCount || 0
        }
      })
    )

    return NextResponse.json(categoriesWithCount)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, slug, color, icon, featured = false } = body

    // 验证必填字段
    if (!name || !description || !slug || !color || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 检查slug是否已存在
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 400 }
      )
    }

    // 获取当前最大排序值
    const { data: maxSortCategory } = await supabase
      .from('categories')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const sortOrder = (maxSortCategory?.sort_order || 0) + 1

    // 创建分类
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        description,
        slug,
        color,
        icon,
        featured,
        sort_order: sortOrder,
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating category:', error)
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}