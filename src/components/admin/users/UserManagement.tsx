'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { UserList } from './UserList'
import { UserForm } from './UserForm'
import { UserDetails } from './UserDetails'

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

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟数据 - 实际应该从API获取
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        name: '系统管理员',
        role: 'admin',
        status: 'active',
        emailVerified: true,
        joinedAt: '2024-01-01',
        lastActiveAt: '2024-01-20 18:30',
        totalComments: 156,
        totalRatings: 89,
        totalFavorites: 45,
        totalReports: 0,
        violationScore: 0
      },
      {
        id: '2',
        username: 'player123',
        email: 'player123@example.com',
        name: '游戏玩家',
        role: 'user',
        status: 'active',
        emailVerified: true,
        joinedAt: '2024-01-05',
        lastActiveAt: '2024-01-20 16:45',
        totalComments: 234,
        totalRatings: 156,
        totalFavorites: 89,
        totalReports: 2,
        violationScore: 15
      },
      {
        id: '3',
        username: 'moderator001',
        email: 'mod@example.com',
        name: '内容审核员',
        role: 'moderator',
        status: 'active',
        emailVerified: true,
        joinedAt: '2024-01-10',
        lastActiveAt: '2024-01-20 15:20',
        totalComments: 89,
        totalRatings: 45,
        totalFavorites: 23,
        totalReports: 0,
        violationScore: 0
      },
      {
        id: '4',
        username: 'banned_user',
        email: 'banned@example.com',
        role: 'user',
        status: 'banned',
        emailVerified: false,
        joinedAt: '2024-01-12',
        lastActiveAt: '2024-01-18 22:15',
        totalComments: 67,
        totalRatings: 34,
        totalFavorites: 12,
        totalReports: 15,
        violationScore: 85
      }
    ]
    
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = users

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // 角色过滤
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleAddUser = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowForm(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('确定要删除这个用户吗？此操作不可恢复。')) {
      setUsers(users.filter(user => user.id !== userId))
      setSelectedUser(null)
    }
  }

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      // 更新用户
      setUsers(users.map(user =>
        user.id === editingUser.id
          ? { ...user, ...userData }
          : user
      ))
    } else {
      // 添加新用户
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username || '',
        email: userData.email || '',
        name: userData.name || '',
        role: userData.role || 'user',
        status: userData.status || 'active',
        emailVerified: userData.emailVerified || false,
        joinedAt: new Date().toISOString().split('T')[0],
        lastActiveAt: new Date().toISOString().split('T')[0],
        totalComments: 0,
        totalRatings: 0,
        totalFavorites: 0,
        totalReports: 0,
        violationScore: 0
      }
      setUsers([...users, newUser])
    }
    setShowForm(false)
    setEditingUser(null)
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? {
            ...user,
            status: user.status === 'active' ? 'inactive' : 'active'
          }
        : user
    ))
  }

  const handleBanUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: 'banned' as const }
        : user
    ))
  }

  const handleUnbanUser = (userId: string) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: 'active' as const }
        : user
    ))
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
  }

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

  if (showForm) {
    return (
      <UserForm
        user={editingUser}
        onSave={handleSaveUser}
        onCancel={() => {
          setShowForm(false)
          setEditingUser(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="mt-2 text-gray-600">管理平台用户和权限</p>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlusIcon className="mr-2 h-4 w-4" />
          添加用户
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    总用户数
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.length}
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
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    活跃用户
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.filter(u => u.status === 'active').length}
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
                <CalendarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    今日新增
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.filter(u => u.joinedAt === new Date().toISOString().split('T')[0]).length}
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
                <ShieldCheckIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    已封禁用户
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {users.filter(u => u.status === 'banned').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索用户
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索用户名、邮箱或姓名..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              角色筛选
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">所有角色</option>
              <option value="admin">管理员</option>
              <option value="moderator">审核员</option>
              <option value="user">普通用户</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态筛选
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">所有状态</option>
              <option value="active">正常</option>
              <option value="inactive">未激活</option>
              <option value="banned">已封禁</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users list and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserList
            users={filteredUsers}
            loading={loading}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
            onBan={handleBanUser}
            onUnban={handleUnbanUser}
            onViewDetails={handleViewDetails}
          />
        </div>

        <div>
          <UserDetails
            user={selectedUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onToggleStatus={handleToggleUserStatus}
            onBan={handleBanUser}
            onUnban={handleUnbanUser}
          />
        </div>
      </div>
    </div>
  )
}