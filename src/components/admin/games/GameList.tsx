'use client'

import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Game {
  id: string
  title: string
  description: string
  category: string
  categoryId: string
  thumbnail: string
  url: string
  iframeUrl: string
  views: number
  playCount: number
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

interface GameListProps {
  games: Game[]
  loading: boolean
  onEdit: (game: Game) => void
  onDelete: (gameId: string) => void
  onToggleFeatured: (gameId: string, currentFeatured: boolean) => void
  onTogglePopular: (gameId: string, currentPopular: boolean) => void
  onToggleNew: (gameId: string, currentNew: boolean) => void
  onToggleTrending: (gameId: string, currentTrending: boolean) => void
  onToggleStatus: (gameId: string, currentStatus: string) => void
}

export function GameList({
  games,
  loading,
  onEdit,
  onDelete,
  onToggleFeatured,
  onTogglePopular,
  onToggleNew,
  onToggleTrending,
  onToggleStatus
}: GameListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '已发布'
      case 'inactive':
        return '已下架'
      case 'pending':
        return '待审核'
      default:
        return '未知'
    }
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  游戏
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  统计
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新时间
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {games.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    暂无游戏数据
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={game.thumbnail || '/images/default-game.jpg'}
                            alt={game.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {game.title}
                            {game.featured && (
                              <StarIcon className="ml-2 h-4 w-4 text-yellow-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {game.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{game.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(game.status)}`}>
                        {getStatusText(game.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <EyeIcon className="mr-1 h-4 w-4 text-gray-400" />
                          {game.views.toLocaleString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <ClockIcon className="mr-1 h-4 w-4 text-gray-400" />
                          {game.playCount.toLocaleString()}
                        </div>
                        <div className="flex items-center mt-1">
                          <StarIcon className="mr-1 h-4 w-4 text-yellow-400" />
                          {game.rating.toFixed(1)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 h-4 w-4 text-gray-400" />
                        {new Date(game.updatedAt).toLocaleDateString('zh-CN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onToggleFeatured(game.id, game.featured)}
                          className={`p-1 rounded-md ${
                            game.featured
                              ? 'text-yellow-600 hover:text-yellow-900'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={game.featured ? '取消推荐' : '设为推荐'}
                        >
                          <StarIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onToggleStatus(game.id, game.status)}
                          className={`p-1 rounded-md ${
                            game.status === 'active'
                              ? 'text-green-600 hover:text-green-900'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={game.status === 'active' ? '下架游戏' : '发布游戏'}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(game)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md"
                          title="编辑游戏"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(game.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md"
                          title="删除游戏"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}