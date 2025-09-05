'use client'

import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  CalendarIcon
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

interface UserListProps {
  users: User[]
  loading: boolean
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string) => void
  onBan: (userId: string) => void
  onUnban: (userId: string) => void
  onViewDetails: (user: User) => void
}

export function UserList({
  users,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
  onBan,
  onUnban,
  onViewDetails
}: UserListProps) {
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
                  用户
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  活跃度
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最后活跃
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    暂无用户数据
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar || '/images/default-avatar.jpg'}
                            alt={user.username}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                            {!user.emailVerified && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                未验证
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <ChatBubbleLeftIcon className="mr-1 h-3 w-3" />
                          {user.totalComments}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <StarIcon className="mr-1 h-3 w-3" />
                          {user.totalRatings}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4 text-gray-400" />
                        {user.lastActiveAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewDetails(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md"
                          title="查看详情"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        
                        {user.status === 'active' && (
                          <button
                            onClick={() => onToggleStatus(user.id)}
                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md"
                            title="停用账号"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {user.status === 'inactive' && (
                          <button
                            onClick={() => onToggleStatus(user.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md"
                            title="激活账号"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => onBan(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md"
                            title="封禁账号"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        {user.status === 'banned' && (
                          <button
                            onClick={() => onUnban(user.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-md"
                            title="解封账号"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => onEdit(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-md"
                          title="编辑用户"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => onDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-md"
                          title="删除用户"
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