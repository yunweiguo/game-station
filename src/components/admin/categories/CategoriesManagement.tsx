'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PuzzlePieceIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { CategoryForm } from './CategoryForm'
import { CategoryList } from './CategoryList'

interface Category {
  id: string
  name: string
  description: string
  slug: string
  color: string
  icon: string
  gameCount: number
  featured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ]

  const icons = [
    'gamepad', 'puzzle', 'target', 'trophy', 'star',
    'heart', 'lightning', 'fire', 'diamond', 'crown'
  ]

  useEffect(() => {
    // 模拟数据 - 实际应该从API获取
    const mockCategories: Category[] = [
      {
        id: '1',
        name: '动作',
        description: '动作类游戏，考验反应和操作',
        slug: 'action',
        color: '#EF4444',
        icon: 'gamepad',
        gameCount: 45,
        featured: true,
        sortOrder: 1,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '2',
        name: '益智',
        description: '益智类游戏，锻炼思维能力',
        slug: 'puzzle',
        color: '#3B82F6',
        icon: 'puzzle',
        gameCount: 32,
        featured: true,
        sortOrder: 2,
        createdAt: '2024-01-14',
        updatedAt: '2024-01-18'
      },
      {
        id: '3',
        name: '策略',
        description: '策略类游戏，考验智慧和策略',
        slug: 'strategy',
        color: '#10B981',
        icon: 'target',
        gameCount: 28,
        featured: false,
        sortOrder: 3,
        createdAt: '2024-01-13',
        updatedAt: '2024-01-13'
      },
      {
        id: '4',
        name: '体育',
        description: '体育类游戏，体验运动乐趣',
        slug: 'sports',
        color: '#F59E0B',
        icon: 'trophy',
        gameCount: 18,
        featured: false,
        sortOrder: 4,
        createdAt: '2024-01-12',
        updatedAt: '2024-01-12'
      }
    ]
    
    setCategories(mockCategories)
    setFilteredCategories(mockCategories)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = categories

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCategories(filtered)
  }, [categories, searchTerm])

  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    if (category && category.gameCount > 0) {
      alert('该分类下还有游戏，无法删除')
      return
    }
    
    if (confirm('确定要删除这个分类吗？')) {
      setCategories(categories.filter(cat => cat.id !== categoryId))
    }
  }

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      // 更新分类
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...categoryData, updatedAt: new Date().toISOString().split('T')[0] }
          : cat
      ))
    } else {
      // 添加新分类
      const newCategory: Category = {
        id: Date.now().toString(),
        name: categoryData.name || '',
        description: categoryData.description || '',
        slug: categoryData.slug || '',
        color: categoryData.color || '#3B82F6',
        icon: categoryData.icon || 'gamepad',
        gameCount: 0,
        featured: false,
        sortOrder: categories.length + 1,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      setCategories([...categories, newCategory])
    }
    setShowForm(false)
    setEditingCategory(null)
  }

  const handleToggleFeatured = (categoryId: string) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId
        ? { ...cat, featured: !cat.featured, updatedAt: new Date().toISOString().split('T')[0] }
        : cat
    ))
  }

  const handleMoveCategory = (categoryId: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(cat => cat.id === categoryId)
    if (index === -1) return

    const newCategories = [...categories]
    
    if (direction === 'up' && index > 0) {
      [newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]]
    } else if (direction === 'down' && index < newCategories.length - 1) {
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]]
    }

    // 更新排序
    const updatedCategories = newCategories.map((cat, idx) => ({
      ...cat,
      sortOrder: idx + 1,
      updatedAt: new Date().toISOString().split('T')[0]
    }))

    setCategories(updatedCategories)
  }

  if (showForm) {
    return (
      <CategoryForm
        category={editingCategory}
        colors={colors}
        icons={icons}
        onSave={handleSaveCategory}
        onCancel={() => {
          setShowForm(false)
          setEditingCategory(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">分类管理</h1>
          <p className="mt-2 text-gray-600">管理游戏分类和排序</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          添加分类
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            搜索分类
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索分类名称或描述..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories list */}
      <CategoryList
        categories={filteredCategories}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onToggleFeatured={handleToggleFeatured}
        onMoveCategory={handleMoveCategory}
      />
    </div>
  )
}