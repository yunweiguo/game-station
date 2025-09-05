'use client'

import {
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  HeartIcon,
  FlagIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface User {
  id: string
  username: string
  email: string
  name?: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'inactive' | 'banned'
  emailVerified: boolean
  joinedAt: string
  lastActiveAt: string
  totalComments: number
  totalRatings: number
  totalFavorites: number
  totalReports: number
  violationScore: number
}

interface UserDetailsProps {
  user: User | null
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string) => void
  onBan: (userId: string) => void
  onUnban: (userId: string) => void
}

export function UserDetails({
  user,
  onEdit,
  onDelete,
  onToggleStatus,
  onBan,
  onUnban
}: UserDetailsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'banned':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '正常'
      case 'inactive':
        return '未激活'
      case 'banned':
        return '已封禁'
      default:
        return '未知'
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'moderator':
        return 'bg-blue-100 text-blue-800'
      case 'user':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return '管理员'
      case 'moderator':
        return '审核员'
      case 'user':
        return '用户'
      default:
        return '未知'
    }
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { color: 'text-red-600', label: '高风险' }
    if (score >= 60) return { color: 'text-orange-600', label: '中风险' }
    if (score >= 40) return { color: 'text-yellow-600', label: '低风险' }
    return { color: 'text-green-600', label: '正常' }
  }

  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">选择用户查看详情</h3>
          <p className="mt-1 text-sm text-gray-500">点击左侧用户查看详细信息</p>
        </div>
      </div>
    )
  }

  const riskLevel = getRiskLevel(user.violationScore)

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="space-y-6">
        {/* User header */}
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar || '/images/default-avatar.jpg'}
            alt={user.name || user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {user.name || user.username}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                {getRoleText(user.role)}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                {getStatusText(user.status)}
              </span>
              {!user.emailVerified && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  未验证邮箱
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">评论</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{user.totalComments}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">评分</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{user.totalRatings}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <HeartIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">收藏</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{user.totalFavorites}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FlagIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">被举报</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{user.totalReports}</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">账户信息</h4>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">用户名</dt>
                <dd className="text-sm text-gray-900">{user.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">邮箱</dt>
                <dd className="text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">加入时间</dt>
                <dd className="text-sm text-gray-900">{user.joinedAt}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">最后活跃</dt>
                <dd className="text-sm text-gray-900">{user.lastActiveAt}</dd>
              </div>
            </dl>
          </div>

          {/* Risk assessment */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">风险评估</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">违规评分</span>
                <span className={`text-sm font-semibold ${riskLevel.color}`}>
                  {user.violationScore}/100 ({riskLevel.label})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    user.violationScore >= 80 ? 'bg-red-600' :
                    user.violationScore >= 60 ? 'bg-orange-600' :
                    user.violationScore >= 40 ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${user.violationScore}%` }}
                ></div>
              </div>
              {user.violationScore > 0 && (
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  该用户存在违规行为记录
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onEdit(user)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              编辑
            </button>

            {user.status === 'active' && (
              <button
                onClick={() => onToggleStatus(user.id)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                停用
              </button>
            )}

            {user.status === 'inactive' && (
              <button
                onClick={() => onToggleStatus(user.id)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                激活
              </button>
            )}

            {user.status !== 'banned' && (
              <button
                onClick={() => onBan(user.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                封禁
              </button>
            )}

            {user.status === 'banned' && (
              <button
                onClick={() => onUnban(user.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                解封
              </button>
            )}

            <button
              onClick={() => onDelete(user.id)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}