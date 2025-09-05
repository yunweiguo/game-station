import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// 获取单个分类
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching category:', error)
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // 获取游戏数量
    const { count: gameCount } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', category.id)
      .eq('status', 'active')

    return NextResponse.json({
      ...category,
      game_count: gameCount || 0
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 更新分类
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, slug, color, icon, featured } = body

    // 检查分类是否存在
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // 如果修改了slug，检查是否与其他分类冲突
    if (slug && slug !== existingCategory.slug) {
      const { data: conflictingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (conflictingCategory) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    const { data: category, error: updateError } = await supabase
      .from('categories')
      .update({
        name: name ?? existingCategory.name,
        description: description ?? existingCategory.description,
        slug: slug ?? existingCategory.slug,
        color: color ?? existingCategory.color,
        icon: icon ?? existingCategory.icon,
        featured: featured ?? existingCategory.featured,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating category:', updateError)
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('更新分类失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 删除分类
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // 检查分类是否存在
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // 检查分类下是否有关联的游戏
    const { count: gameCount } = await supabase
      .from('games')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id)

    if (gameCount && gameCount > 0) {
      return NextResponse.json({ error: 'Cannot delete category with associated games' }, { status: 400 })
    }

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting category:', deleteError)
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('删除分类失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 更新分类排序和状态
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action } = body

    // 检查分类是否存在
    const { data: existingCategory, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    let updatedCategory

    switch (action) {
      case 'toggleFeatured':
        const { data: toggledCategory, error: toggleError } = await supabase
          .from('categories')
          .update({ 
            featured: !existingCategory.featured,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (toggleError) {
          console.error('Error toggling featured:', toggleError)
          return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
        }
        updatedCategory = toggledCategory
        break
      case 'moveUp':
      case 'moveDown':
        // 获取所有分类并按排序
        const { data: allCategories, error: listError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })

        if (listError) {
          console.error('Error fetching categories:', listError)
          return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
        }

        const currentIndex = allCategories.findIndex((cat: { id: string }) => cat.id === id)
        if (currentIndex === -1) {
          return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }

        let newIndex = currentIndex
        if (action === 'moveUp' && currentIndex > 0) {
          newIndex = currentIndex - 1
        } else if (action === 'moveDown' && currentIndex < allCategories.length - 1) {
          newIndex = currentIndex + 1
        }

        if (newIndex !== currentIndex) {
          // 交换排序值
          const [currentCategory, targetCategory] = [
            allCategories[currentIndex],
            allCategories[newIndex]
          ]

          await Promise.all([
            supabase
              .from('categories')
              .update({ 
                sort_order: targetCategory.sort_order,
                updated_at: new Date().toISOString()
              })
              .eq('id', currentCategory.id),
            supabase
              .from('categories')
              .update({ 
                sort_order: currentCategory.sort_order,
                updated_at: new Date().toISOString()
              })
              .eq('id', targetCategory.id)
          ])
        }

        const { data: reorderedCategory } = await supabase
          .from('categories')
          .select('*')
          .eq('id', id)
          .single()

        updatedCategory = reorderedCategory
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('更新分类失败:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}