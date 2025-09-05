'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface FlaggedUser {
  id: string
  username: string
  email: string
  avatar?: string
  joinedAt: string
  lastActiveAt: string
  reportCount: number
  reportReasons: string[]
  status: 'active' | 'suspended' | 'banned'
  violationScore: number
  totalComments: number
  totalReports: number
}

export function UserModeration() {
  const [users, setUsers] = useState<FlaggedUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<FlaggedUser[]>([])
  const [selectedUser, setSelectedUser] = useState<FlaggedUser | null>(null)
  const [filter, setFilter] = useState<'all' | 'flagged' | 'suspended' | 'banned'>('flagged')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟数据 - 实际应该从API获取
    const mockUsers: FlaggedUser[] = [
      {
        id: '1',
        username: '恶意用户001',
        email: 'malicious001@example.com',
        joinedAt: '2024-01-10',
        lastActiveAt: '2024-01-20 15:30',
        reportCount: 15,
        reportReasons: ['垃圾信息', '人身攻击', '仇恨言论', '多次举报'],
        status: 'active',
        violationScore: 85,
        totalComments: 45,
        totalReports: 12
      },
      {
        id: '2',
        username: '违规用户002',
        email: 'violator002@example.com',
        joinedAt: '2024-01-05',
        lastActiveAt: '2024-01-19 22:15',
        reportCount: 8,
        reportReasons: ['不当言论', '骚扰其他用户'],
        status: 'suspended',
        violationScore: 65,
        totalComments: 23,
        totalReports: 6
      },
      {
        id: '3',
        username: '被封用户003',
        email: 'banned003@example.com',
        joinedAt: '2024-01-01',
        lastActiveAt: '2024-01-15 10:30',
        reportCount: 25,
        reportReasons: ['严重违规', '威胁他人', '发布违法内容'],
        status: 'banned',
        violationScore: 95,
        totalComments: 67,
        totalReports: 20
      },
      {
        id: '4',
        username: '新用户004',
        email: 'newuser004@example.com',
        joinedAt: '2024-01-20',
        lastActiveAt: '2024-01-20 16:45',
        reportCount: 3,
        reportReasons: ['可疑行为'],
        status: 'active',
        violationScore: 35,
        totalComments: 8,
        totalReports: 2
      }
    ]
    
    setUsers(mockUsers)
    setFilteredUsers(mockUsers.filter(user => user.reportCount > 0))
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = users

    if (filter === 'flagged') {
      filtered = users.filter(user => user.reportCount > 0 && user.status === 'active')
    } else if (filter === 'suspended') {
      filtered = users.filter(user => user.status === 'suspended')
    } else if (filter === 'banned') {
      filtered = users.filter(user => user.status === 'banned')
    }

    setFilteredUsers(filtered)
  }, [users, filter])

  const handleSuspend = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: 'suspended' as const }
        : user
    ))
    setSelectedUser(null)
  }

  const handleBan = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: 'banned' as const }
        : user
    ))
    setSelectedUser(null)
  }

  const handleReinstate = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: 'active' as const, reportCount: 0, violationScore: 0 }
        : user
    ))
    setSelectedUser(null)
  }

  const handleViewDetails = (user: FlaggedUser) => {
    setSelectedUser(user)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'suspended':
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
      case 'suspended':
        return '暂停'
      case 'banned':
        return '封禁'
      default:
        return '未知'
    }
  }

  const getRiskBadge = (score: number) => {
    let color = 'bg-green-100 text-green-800'
    let label = '低风险'
    
    if (score >= 80) {
      color = 'bg-red-100 text-red-800'
      label = '高风险'
    } else if (score >= 60) {
      color = 'bg-orange-100 text-orange-800'
      label = '中风险'
    } else if (score >= 40) {
      color = 'bg-yellow-100 text-yellow-800'
      label = '注意'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label} ({score}%)
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
            { key: 'flagged', label: '被举报用户', count: users.filter(u => u.reportCount > 0 && u.status === 'active').length },
            { key: 'suspended', label: '暂停用户', count: users.filter(u => u.status === 'suspended').length },
            { key: 'banned', label: '封禁用户', count: users.filter(u => u.status === 'banned').length }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as 'flagged' | 'suspended' | 'banned')}
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

      {/* Users list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无相关用户</h3>
              <p className="mt-1 text-sm text-gray-500">当前筛选条件下没有用户</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleViewDetails(user)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={user.avatar || '/images/default-avatar.jpg'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {user.username}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                            {getStatusText(user.status)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          加入时间: {user.joinedAt} • 最后活跃: {user.lastActiveAt}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-1">
                          {getRiskBadge(user.violationScore)}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <ExclamationTriangleIcon className="mr-1 h-3 w-3" />
                            {user.reportCount} 举报
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          {user.status === 'active' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSuspend(user.id)
                                }}
                                className="p-1 text-yellow-600 hover:text-yellow-800 rounded-md"
                                title="暂停账号"
                              >
                                <ShieldCheckIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleBan(user.id)
                                }}
                                className="p-1 text-red-600 hover:text-red-800 rounded-md"
                                title="封禁账号"
                              >
                                <XCircleIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                          {(user.status === 'suspended' || user.status === 'banned') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleReinstate(user.id)
                              }}
                              className="p-1 text-green-600 hover:text-green-800 rounded-md"
                              title="恢复账号"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>评论: {user.totalComments}</span>
                      <span>被举报: {user.totalReports}</span>
                    </div>
                    {user.reportReasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.reportReasons.slice(0, 3).map((reason, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800"
                          >
                            {reason}
                          </span>
                        ))}
                        {user.reportReasons.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{user.reportReasons.length - 3} 更多
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* User details */}
        <div className="bg-gray-50 rounded-lg p-6">
          {selectedUser ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">用户详情</h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={selectedUser.avatar || '/images/default-avatar.jpg'}
                      alt={selectedUser.username}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedUser.username}
                      </h4>
                      <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedUser.status)}`}>
                          {getStatusText(selectedUser.status)}
                        </span>
                        {getRiskBadge(selectedUser.violationScore)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">加入时间</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedUser.joinedAt}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">最后活跃</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedUser.lastActiveAt}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">总评论数</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedUser.totalComments}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">被举报次数</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedUser.totalReports}</p>
                    </div>
                  </div>

                  {selectedUser.reportReasons.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">举报原因</label>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedUser.reportReasons.map((reason, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800"
                          >
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                {selectedUser.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleSuspend(selectedUser.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      <ShieldCheckIcon className="mr-2 h-4 w-4" />
                      暂停账号
                    </button>
                    <button
                      onClick={() => handleBan(selectedUser.id)}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <XCircleIcon className="mr-2 h-4 w-4" />
                      永久封禁
                    </button>
                  </>
                )}
                {(selectedUser.status === 'suspended' || selectedUser.status === 'banned') && (
                  <button
                    onClick={() => handleReinstate(selectedUser.id)}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircleIcon className="mr-2 h-4 w-4" />
                    恢复账号
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">选择用户查看详情</h3>
              <p className="mt-1 text-sm text-gray-500">点击左侧用户查看详细信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}