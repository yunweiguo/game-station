'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface Game {
  id: string
  title: string
  description: string
  category: string
  categoryId: string
  thumbnail: string
  iframeUrl: string
  views: number
  rating: number
  featured: boolean
  popular: boolean
  new: boolean
  trending: boolean
  status: 'active' | 'inactive' | 'pending'
  tags: string[]
  difficulty: string
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface GameFormData {
  title?: string
  name?: string
  description: string
  category_id: string
  thumbnail: string
  iframe_url: string
  tags: string | string[]
  featured: boolean
  popular: boolean
  new: boolean
  trending: boolean
  status: 'active' | 'inactive' | 'pending'
  slug?: string
}

interface GameFormProps {
  game: Game | null
  categories: Category[]
  onSave: (gameData: GameFormData) => void
  onCancel: () => void
}

export function GameForm({ game, categories, onSave, onCancel }: GameFormProps) {
  
  const [formData, setFormData] = useState({
    title: game?.title || '',
    description: game?.description || '',
    category_id: game?.categoryId || '',
    thumbnail: game?.thumbnail || '',
    iframe_url: game?.iframeUrl || '',
    tags: game?.tags?.join(', ') || '',
    featured: game?.featured || false,
    popular: game?.popular || false,
    new: game?.new || false,
    trending: game?.trending || false,
    status: game?.status || 'pending' as const
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 当game对象变化时更新表单数据
  useEffect(() => {
    if (game) {
      setFormData({
        title: game.title || '',
        description: game.description || '',
        category_id: game.categoryId || '',
        thumbnail: game.thumbnail || '',
        iframe_url: game.iframeUrl || '',
        tags: game.tags?.join(', ') || '',
        featured: game.featured || false,
        popular: game.popular || false,
        new: game.new || false,
        trending: game.trending || false,
        status: game.status || 'pending'
      })
    }
  }, [game])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '游戏标题不能为空'
    }

    if (!formData.description.trim()) {
      newErrors.description = '游戏描述不能为空'
    }

    if (!formData.category_id) {
      newErrors.category_id = '请选择游戏分类'
    }

    if (!formData.iframe_url.trim()) {
      newErrors.iframe_url = '游戏嵌入URL不能为空'
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = '游戏缩略图URL不能为空'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // 生成slug
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      const gameData = {
        name: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        thumbnail: formData.thumbnail,
        iframe_url: formData.iframe_url,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
        featured: formData.featured,
        popular: formData.popular,
        new: formData.new,
        trending: formData.trending,
        status: formData.status,
        slug
      }
      
      await onSave(gameData)
    } catch (error) {
      console.error('保存游戏失败:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {game ? '编辑游戏' : '添加游戏'}
          </h1>
          <p className="mt-2 text-gray-600">
            {game ? '修改游戏信息' : '添加新游戏到平台'}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <XMarkIcon className="mr-2 h-4 w-4" />
          取消
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                游戏标题 *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="输入游戏标题"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                游戏分类 *
              </label>
              <select
                id="category_id"
                value={formData.category_id}
                onChange={(e) => handleInputChange('category_id', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.category_id ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              >
                <option value="">选择分类</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                游戏描述 *
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="输入游戏描述"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label htmlFor="iframe_url" className="block text-sm font-medium text-gray-700">
                游戏URL *
              </label>
              <input
                type="url"
                id="iframe_url"
                value={formData.iframe_url}
                onChange={(e) => handleInputChange('iframe_url', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.iframe_url ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="https://example.com/game.html"
              />
              <p className="mt-1 text-xs text-gray-500">
                游戏的完整URL地址
              </p>
              {errors.iframe_url && (
                <p className="mt-1 text-sm text-red-600">{errors.iframe_url}</p>
              )}
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
                缩略图URL *
              </label>
              <input
                type="url"
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.thumbnail ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="https://example.com/thumbnail.jpg"
              />
              {errors.thumbnail && (
                <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                标签
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="动作,射击,冒险 (用逗号分隔)"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                状态
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="pending">待审核</option>
                <option value="active">已发布</option>
                <option value="inactive">已下架</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                设为推荐游戏
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) => handleInputChange('popular', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                设为热门游戏
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="new"
                checked={formData.new}
                onChange={(e) => handleInputChange('new', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="new" className="ml-2 block text-sm text-gray-900">
                设为新游戏
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="trending"
                checked={formData.trending}
                onChange={(e) => handleInputChange('trending', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="trending" className="ml-2 block text-sm text-gray-900">
                设为趋势游戏
              </label>
            </div>
          </div>

          {/* 预览区域 */}
          {(formData.thumbnail || formData.title) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">预览</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-4">
                  {formData.thumbnail && (
                    <Image
                      src={formData.thumbnail}
                      alt="预览"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-md object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-game.jpg'
                      }}
                    />
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {formData.title || '游戏标题'}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.category_id && `分类: ${categories.find(c => c.id === formData.category_id)?.name || '未分类'}`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description || '游戏描述'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '保存中...' : (game ? '更新游戏' : '添加游戏')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}