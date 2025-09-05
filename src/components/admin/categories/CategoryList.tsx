'use client'

import {
  PencilIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  StarIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'

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

interface CategoryListProps {
  categories: Category[]
  loading: boolean
  onEdit: (category: Category) => void
  onDelete: (categoryId: string) => void
  onToggleFeatured: (categoryId: string) => void
  onMoveCategory: (categoryId: string, direction: 'up' | 'down') => void
}

export function CategoryList({
  categories,
  loading,
  onEdit,
  onDelete,
  onToggleFeatured,
  onMoveCategory
}: CategoryListProps) {
  const getIconComponent = (iconName: string) => {
    return <PuzzlePieceIcon className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <PuzzlePieceIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无分类</h3>
              <p className="mt-1 text-sm text-gray-500">开始添加第一个游戏分类吧</p>
            </div>
          ) : (
            categories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((category, index) => (
                <div
                  key={category.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {getIconComponent(category.icon)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          {category.name}
                          {category.featured && (
                            <StarIcon className="ml-2 h-4 w-4 text-yellow-400" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.gameCount} 个游戏
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onMoveCategory(category.id, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded-md ${
                          index === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title="上移"
                      >
                        <ArrowUpIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onMoveCategory(category.id, 'down')}
                        disabled={index === categories.length - 1}
                        className={`p-1 rounded-md ${
                          index === categories.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title="下移"
                      >
                        <ArrowDownIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>排序: {category.sortOrder}</span>
                      <span>•</span>
                      <span>slug: {category.slug}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onToggleFeatured(category.id)}
                        className={`p-1 rounded-md ${
                          category.featured
                            ? 'text-yellow-600 hover:text-yellow-900'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                        title={category.featured ? '取消推荐' : '设为推荐'}
                      >
                        <StarIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(category)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md"
                        title="编辑分类"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(category.id)}
                        disabled={category.gameCount > 0}
                        className={`p-1 rounded-md ${
                          category.gameCount > 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-900'
                        }`}
                        title={category.gameCount > 0 ? '分类下有游戏，无法删除' : '删除分类'}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  )
}