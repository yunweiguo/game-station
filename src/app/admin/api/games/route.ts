import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取所有游戏
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    const featured = searchParams.get('featured') || ''

    let query = supabase
      .from('games')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          color,
          icon
        )
      `, { count: 'exact' })

    // 搜索过滤
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // 分类过滤
    if (category && category !== 'all') {
      query = query.eq('category_id', category)
    }

    // 状态过滤
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // 特色游戏过滤
    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    // 分页
    const offset = (page - 1) * limit
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching games:', error)
      return NextResponse.json(
        { error: 'Failed to fetch games' },
        { status: 500 }
      )
    }

    // 获取所有分类用于过滤
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, slug')
      .eq('status', 'active')
      .order('sort_order')

    return NextResponse.json({
      games: data || [],
      categories: categories || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 创建新游戏
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      category_id,
      iframe_url,
      thumbnail,
      tags,
      featured,
      popular,
      new: isNew,
      trending,
      status
    } = body

    // 验证必填字段
    if (!name || !slug || !category_id || !iframe_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 检查slug是否已存在
    const { data: existingGame } = await supabase
      .from('games')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingGame) {
      return NextResponse.json(
        { error: 'Game with this slug already exists' },
        { status: 400 }
      )
    }

    // 创建游戏
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        name,
        slug,
        description,
        category_id,
        iframe_url,
        thumbnail,
        tags: tags || [],
        featured: featured || false,
        popular: popular || false,
        new: isNew || false,
        trending: trending || false,
        status: status || 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating game:', error)
      return NextResponse.json(
        { error: 'Failed to create game' },
        { status: 500 }
      )
    }

    // 创建游戏统计记录
    await supabase
      .from('game_stats')
      .insert({
        game_id: game.id,
        play_count: 0,
        view_count: 0,
        favorite_count: 0,
        comment_count: 0,
        rating_count: 0,
        average_rating: 0.00
      })

    return NextResponse.json({
      success: true,
      message: 'Game created successfully',
      game
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}