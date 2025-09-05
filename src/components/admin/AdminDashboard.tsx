'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  UserGroupIcon,
  PuzzlePieceIcon,
  EyeIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalGames: number
  totalUsers: number
  totalViews: number
  totalPlays: number
  totalRatings: number
  recentGames: Array<{
    id: string
    title: string
    views: number
    rating: number
    playCount: number
  }>
  recentUsers: Array<{
    id: string
    name: string
    email: string
    joinedAt: string
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalGames: 0,
    totalUsers: 0,
    totalViews: 0,
    totalPlays: 0,
    totalRatings: 0,
    recentGames: [],
    recentUsers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/admin/api/dashboard')
      const data = await response.json()
      
      if (data) {
        setStats({
          totalGames: data.totalGames,
          totalUsers: data.totalUsers,
          totalViews: data.totalViews,
          totalPlays: data.totalPlays,
          totalRatings: data.totalRatings,
          recentGames: data.recentGames,
          recentUsers: data.recentUsers
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      name: '总游戏数',
      value: stats.totalGames,
      icon: PuzzlePieceIcon,
      change: '+12%',
      changeType: 'positive' as const
    },
    {
      name: '总用户数',
      value: stats.totalUsers,
      icon: UserGroupIcon,
      change: '+5%',
      changeType: 'positive' as const
    },
    {
      name: '总浏览量',
      value: stats.totalViews,
      icon: EyeIcon,
      change: '+18%',
      changeType: 'positive' as const
    },
    {
      name: '总游戏次数',
      value: stats.totalPlays,
      icon: ClockIcon,
      change: '+15%',
      changeType: 'positive' as const
    },
    {
      name: '总评分数',
      value: stats.totalRatings,
      icon: StarIcon,
      change: '+8%',
      changeType: 'positive' as const
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
          <p className="mt-2 text-gray-600">欢迎来到游戏站管理后台</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
        <p className="mt-2 text-gray-600">欢迎来到游戏站管理后台</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <card.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {card.value.toLocaleString()}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span>{card.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent games */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              最近添加的游戏
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {stats.recentGames.map((game, index) => (
                  <li key={game.id}>
                    <div className="relative pb-8">
                      {index !== stats.recentGames.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <PuzzlePieceIcon className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              {game.title}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <p>{game.views} 次浏览</p>
                            <p>{game.playCount} 次游戏</p>
                            <p className="text-yellow-500">★ {game.rating}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              新注册用户
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {stats.recentUsers.map((user, index) => (
                  <li key={user.id}>
                    <div className="relative pb-8">
                      {index !== stats.recentUsers.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                            <UserGroupIcon className="h-4 w-4 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900 font-medium">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <ClockIcon className="h-4 w-4 inline mr-1" />
                            {user.joinedAt}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}