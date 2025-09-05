import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// 获取单个游戏
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data: game, error } = await supabase
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
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching game:', error)
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ game })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新游戏
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
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

    // 检查游戏是否存在
    const { data: existingGame } = await supabase
      .from('games')
      .select('id, slug')
      .eq('id', id)
      .single()

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // 如果更改了slug，检查新slug是否已存在
    if (slug && slug !== existingGame.slug) {
      const { data: slugGame } = await supabase
        .from('games')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (slugGame) {
        return NextResponse.json(
          { error: 'Game with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // 更新游戏
    const { data: game, error } = await supabase
      .from('games')
      .update({
        name: name || existingGame.name,
        slug: slug || existingGame.slug,
        description: description || existingGame.description,
        category_id: category_id || existingGame.category_id,
        iframe_url: iframe_url || existingGame.iframe_url,
        thumbnail: thumbnail || existingGame.thumbnail,
        tags: tags || existingGame.tags,
        featured: featured !== undefined ? featured : existingGame.featured,
        popular: popular !== undefined ? popular : existingGame.popular,
        new: isNew !== undefined ? isNew : existingGame['new'],
        trending: trending !== undefined ? trending : existingGame.trending,
        status: status || existingGame.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating game:', error)
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Game updated successfully',
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

// 删除游戏
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // 检查游戏是否存在
    const { data: existingGame } = await supabase
      .from('games')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingGame) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // 删除游戏（级联删除会自动处理相关记录）
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting game:', error)
      return NextResponse.json(
        { error: 'Failed to delete game' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Game deleted successfully'
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
