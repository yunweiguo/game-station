'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { GameForm } from './GameForm'
import { GameList } from './GameList'

interface Game {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string
  url: string
  views: number
  rating: number
  featured: boolean
  popular: boolean
  new: boolean
  trending: boolean
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  updatedAt: string
}

export function GamesManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [categoriesList, setCategoriesList] = useState<Array<{id: string, name: string, slug: string}>>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await fetch('/admin/api/games')
      const data = await response.json()
      
      if (data.games) {
        const formattedGames = data.games.map((game: any) => ({
          id: game.id,
          title: game.name,
          description: game.description,
          category: game.categories?.name || '未分类',
          categoryId: game.category_id || game.categories?.id || '',
          thumbnail: game.thumbnail,
          url: game.url,
          iframeUrl: game.iframe_url,
          views: 0, // 暂时设为0，因为数据库中没有views字段
          playCount: game.play_count || 0,
          rating: game.rating || 0,
          featured: game.featured,
          popular: game.popular,
          new: game.new,
          trending: game.trending,
          status: game.status,
          tags: game.tags || [],
          difficulty: 'medium', // 默认值
          createdAt: game.created_at,
          updatedAt: game.updated_at
        }))
        
        setGames(formattedGames)
        setFilteredGames(formattedGames)
        
        // 更新分类列表
        if (data.categories) {
          setCategoriesList(data.categories.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug
          })))
        }
      }
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = games

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(game => game.categoryId === selectedCategory)
    }

    // 状态过滤
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(game => game.status === selectedStatus)
    }

    setFilteredGames(filtered)
  }, [games, searchTerm, selectedCategory, selectedStatus])

  const handleAddGame = () => {
    setEditingGame(null)
    setShowForm(true)
  }

  const handleEditGame = (game: Game) => {
    setEditingGame(game)
    setShowForm(true)
  }

  const handleDeleteGame = async (gameId: string) => {
    if (confirm('确定要删除这个游戏吗？')) {
      try {
        const response = await fetch(`/admin/api/games/${gameId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          await fetchGames() // 重新获取游戏列表
        } else {
          alert('删除游戏失败')
        }
      } catch (error) {
        console.error('Error deleting game:', error)
        alert('删除游戏失败')
      }
    }
  }

  const handleSaveGame = async (gameData: any) => {
    try {
      const url = editingGame 
        ? `/admin/api/games/${editingGame.id}`
        : '/admin/api/games'
      
      const method = editingGame ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      })
      
      if (response.ok) {
        await fetchGames() // 重新获取游戏列表
        setShowForm(false)
        setEditingGame(null)
      } else {
        const error = await response.json()
        alert(error.error || '保存游戏失败')
      }
    } catch (error) {
      console.error('Error saving game:', error)
      alert('保存游戏失败')
    }
  }

  const handleToggleFeatured = async (gameId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/admin/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ featured: !currentFeatured })
      })
      
      if (response.ok) {
        await fetchGames() // 重新获取游戏列表
      } else {
        alert('更新游戏失败')
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
      alert('更新游戏失败')
    }
  }

  const handleToggleStatus = async (gameId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/admin/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        await fetchGames() // 重新获取游戏列表
      } else {
        alert('更新游戏状态失败')
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('更新游戏状态失败')
    }
  }

  const handleTogglePopular = async (gameId: string, currentPopular: boolean) => {
    try {
      const response = await fetch(`/admin/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ popular: !currentPopular })
      })
      
      if (response.ok) {
        await fetchGames() // 重新获取游戏列表
      } else {
        alert('更新游戏失败')
      }
    } catch (error) {
      console.error('Error toggling popular:', error)
      alert('更新游戏失败')
    }
  }

  const handleToggleNew = async (gameId: string, currentNew: boolean) => {
    try {
      const response = await fetch(`/admin/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ new: !currentNew })
      })
      
      if (response.ok) {
        await fetchGames() // 重新获取游戏列表
      } else {
        alert('更新游戏失败')
      }
    } catch (error) {
      console.error('Error toggling new:', error)
      alert('更新游戏失败')
    }
  }

  const handleToggleTrending = async (gameId: string, currentTrending: boolean) => {
    try {
      const response = await fetch(`/admin/api/games/${gameId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ trending: !currentTrending })
      })
      
      if (response.ok) {
        await fetchGames() // 重新获取游戏列表
      } else {
        alert('更新游戏失败')
      }
    } catch (error) {
      console.error('Error toggling trending:', error)
      alert('更新游戏失败')
    }
  }

  if (showForm) {
    return (
      <GameForm
        game={editingGame}
        categories={categoriesList}
        onSave={handleSaveGame}
        onCancel={() => {
          setShowForm(false)
          setEditingGame(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">游戏管理</h1>
          <p className="mt-2 text-gray-600">管理游戏内容和设置</p>
        </div>
        <button
          onClick={handleAddGame}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          添加游戏
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              搜索游戏
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="搜索游戏名称或描述..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类筛选
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">所有分类</option>
              {categoriesList.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              状态筛选
            </label>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">所有状态</option>
              <option value="active">已发布</option>
              <option value="inactive">已下架</option>
              <option value="pending">待审核</option>
            </select>
          </div>
        </div>
      </div>

      {/* Games list */}
      <GameList
        games={filteredGames}
        loading={loading}
        onEdit={handleEditGame}
        onDelete={handleDeleteGame}
        onToggleFeatured={handleToggleFeatured}
        onTogglePopular={handleTogglePopular}
        onToggleNew={handleToggleNew}
        onToggleTrending={handleToggleTrending}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}