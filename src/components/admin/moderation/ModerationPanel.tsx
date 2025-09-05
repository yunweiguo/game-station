'use client'

import { useState, useEffect } from 'react'
import {
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FlagIcon,
  ChatBubbleLeftIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { GameModeration } from './GameModeration'
import { CommentModeration } from './CommentModeration'
import { UserModeration } from './UserModeration'

interface ModerationStats {
  pendingGames: number
  pendingComments: number
  flaggedUsers: number
  todayReports: number
}

export function ModerationPanel() {
  const [stats, setStats] = useState<ModerationStats>({
    pendingGames: 0,
    pendingComments: 0,
    flaggedUsers: 0,
    todayReports: 0
  })
  const [activeTab, setActiveTab] = useState<'games' | 'comments' | 'users'>('games')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟数据 - 实际应该从API获取
    const mockStats: ModerationStats = {
      pendingGames: 12,
      pendingComments: 45,
      flaggedUsers: 8,
      todayReports: 23
    }
    
    setStats(mockStats)
    setLoading(false)
  }, [])

  const tabs = [
    {
      id: 'games' as const,
      name: '游戏审核',
      icon: ShieldCheckIcon,
      count: stats.pendingGames,
      color: 'bg-blue-500'
    },
    {
      id: 'comments' as const,
      name: '评论审核',
      icon: ChatBubbleLeftIcon,
      count: stats.pendingComments,
      color: 'bg-green-500'
    },
    {
      id: 'users' as const,
      name: '用户审核',
      icon: UserIcon,
      count: stats.flaggedUsers,
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">内容审核</h1>
        <p className="mt-2 text-gray-600">管理待审核内容和用户举报</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    待审核游戏
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.pendingGames}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    待审核评论
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.pendingComments}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    被举报用户
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.flaggedUsers}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FlagIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    今日举报
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.todayReports}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon
                  className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
                {tab.count > 0 && (
                  <span
                    className={`ml-2 inline-block py-0.5 px-2 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === 'games' && <GameModeration />}
          {activeTab === 'comments' && <CommentModeration />}
          {activeTab === 'users' && <UserModeration />}
        </div>
      </div>
    </div>
  )
}