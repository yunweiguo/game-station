'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface PendingGame {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  url: string
  submittedBy: string
  submittedAt: string
  reportCount?: number
  reportReasons?: string[]
}

export function GameModeration() {
  const [games, setGames] = useState<PendingGame[]>([])
  const [filteredGames, setFilteredGames] = useState<PendingGame[]>([])
  const [selectedGame, setSelectedGame] = useState<PendingGame | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reported'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟数据 - 实际应该从API获取
    const mockGames: PendingGame[] = [
      {
        id: '1',
        title: '超级马里奥跑酷',
        description: '经典跑酷游戏的网页版本，玩家控制马里奥躲避障碍物',
        category: '动作',
        thumbnail: '/images/games/mario-run.jpg',
        url: '/games/mario-run',
        submittedBy: 'user123',
        submittedAt: '2024-01-20 14:30',
        reportCount: 2,
        reportReasons: ['内容不当', '版权问题']
      },
      {
        id: '2',
        title: '2048数字游戏',
        description: '经典的数字合成游戏，通过移动数字方块来达到2048',
        category: '益智',
        thumbnail: '/images/games/2048.jpg',
        url: '/games/2048',
        submittedBy: 'user456',
        submittedAt: '2024-01-20 10:15'
      },
      {
        id: '3',
        title: '射击游戏',
        description: '第一人称射击游戏，包含暴力内容',
        category: '射击',
        thumbnail: '/images/games/shooter.jpg',
        url: '/games/shooter',
        submittedBy: 'user789',
        submittedAt: '2024-01-19 16:45',
        reportCount: 5,
        reportReasons: ['暴力内容', '不适合儿童', '血腥画面']
      }
    ]
    
    setGames(mockGames)
    setFilteredGames(mockGames)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = games

    if (filter === 'pending') {
      filtered = games.filter(game => !game.reportCount)
    } else if (filter === 'reported') {
      filtered = games.filter(game => game.reportCount && game.reportCount > 0)
    }

    setFilteredGames(filtered)
  }, [games, filter])

  const handleApprove = (gameId: string) => {
    setGames(games.filter(game => game.id !== gameId))
    setSelectedGame(null)
  }

  const handleReject = (gameId: string) => {
    setGames(games.filter(game => game.id !== gameId))
    setSelectedGame(null)
  }

  const handleViewDetails = (game: PendingGame) => {
    setSelectedGame(game)
  }

  const getReportBadge = (reportCount?: number) => {
    if (!reportCount || reportCount === 0) return null
    
    let color = 'bg-yellow-100 text-yellow-800'
    if (reportCount >= 5) color = 'bg-red-100 text-red-800'
    else if (reportCount >= 3) color = 'bg-orange-100 text-orange-800'

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
        {reportCount} 举报
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Filters">
          {[
            { key: 'all', label: '全部', count: games.length },
            { key: 'pending', label: '待审核', count: games.filter(g => !g.reportCount).length },
            { key: 'reported', label: '被举报', count: games.filter(g => g.reportCount && g.reportCount > 0).length }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as 'all' | 'pending' | 'reported')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === item.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.label}
              {item.count > 0 && (
                <span className={`ml-2 inline-block py-0.5 px-2 text-xs rounded-full ${
                  filter === item.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Games list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredGames.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无待审核游戏</h3>
              <p className="mt-1 text-sm text-gray-500">所有游戏都已审核完成</p>
            </div>
          ) : (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedGame?.id === game.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleViewDetails(game)}
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={game.thumbnail || '/images/default-game.jpg'}
                    alt={game.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {game.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {game.category} • 提交者: {game.submittedBy}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {game.submittedAt}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {getReportBadge(game.reportCount)}
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApprove(game.id)
                            }}
                            className="p-1 text-green-600 hover:text-green-800 rounded-md"
                            title="通过"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReject(game.id)
                            }}
                            className="p-1 text-red-600 hover:text-red-800 rounded-md"
                            title="拒绝"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Game details */}
        <div className="bg-gray-50 rounded-lg p-6">
          {selectedGame ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">游戏详情</h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={selectedGame.thumbnail || '/images/default-game.jpg'}
                      alt={selectedGame.title}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedGame.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {selectedGame.category} • {selectedGame.submittedAt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">描述</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedGame.description}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">游戏URL</label>
                      <p className="text-sm text-blue-600 mt-1 break-all">{selectedGame.url}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">提交者</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedGame.submittedBy}</p>
                    </div>

                    {selectedGame.reportCount && selectedGame.reportCount > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">举报信息</label>
                        <div className="mt-1 space-y-1">
                          <p className="text-sm text-red-600">
                            举报次数: {selectedGame.reportCount}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedGame.reportReasons?.map((reason, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800"
                              >
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(selectedGame.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  通过审核
                </button>
                <button
                  onClick={() => handleReject(selectedGame.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  拒绝审核
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">选择游戏查看详情</h3>
              <p className="mt-1 text-sm text-gray-500">点击左侧游戏查看详细信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}