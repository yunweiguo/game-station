'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface PendingComment {
  id: string
  content: string
  gameId: string
  gameTitle: string
  userId: string
  username: string
  userAvatar?: string
  createdAt: string
  reportCount?: number
  reportReasons?: string[]
  toxicityScore?: number
}

export function CommentModeration() {
  const [comments, setComments] = useState<PendingComment[]>([])
  const [filteredComments, setFilteredComments] = useState<PendingComment[]>([])
  const [selectedComment, setSelectedComment] = useState<PendingComment | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'reported' | 'toxic'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟数据 - 实际应该从API获取
    const mockComments: PendingComment[] = [
      {
        id: '1',
        content: '这个游戏太棒了！我玩了整整一个下午，非常有趣！',
        gameId: '1',
        gameTitle: '超级马里奥',
        userId: 'user123',
        username: '游戏玩家',
        createdAt: '2024-01-20 15:30',
        toxicityScore: 0.1
      },
      {
        id: '2',
        content: '垃圾游戏，根本玩不下去，浪费我的时间！',
        gameId: '2',
        gameTitle: '俄罗斯方块',
        userId: 'user456',
        username: '愤怒的玩家',
        createdAt: '2024-01-20 14:15',
        reportCount: 3,
        reportReasons: ['不当言论', '恶意攻击'],
        toxicityScore: 0.8
      },
      {
        id: '3',
        content: '游戏还行，但是有点难，建议降低难度。',
        gameId: '3',
        gameTitle: '贪吃蛇',
        userId: 'user789',
        username: '休闲玩家',
        createdAt: '2024-01-20 13:45',
        toxicityScore: 0.2
      },
      {
        id: '4',
        content: '开发者是傻子吗？这游戏做的是什么玩意儿？赶紧去死吧！',
        gameId: '1',
        gameTitle: '超级马里奥',
        userId: 'user999',
        username: '恶意用户',
        createdAt: '2024-01-20 12:30',
        reportCount: 8,
        reportReasons: ['人身攻击', '仇恨言论', '威胁内容'],
        toxicityScore: 0.95
      }
    ]
    
    setComments(mockComments)
    setFilteredComments(mockComments)
    setLoading(false)
  }, [])

  useEffect(() => {
    let filtered = comments

    if (filter === 'pending') {
      filtered = comments.filter(comment => !comment.reportCount)
    } else if (filter === 'reported') {
      filtered = comments.filter(comment => comment.reportCount && comment.reportCount > 0)
    } else if (filter === 'toxic') {
      filtered = comments.filter(comment => (comment.toxicityScore || 0) > 0.7)
    }

    setFilteredComments(filtered)
  }, [comments, filter])

  const handleApprove = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId))
    setSelectedComment(null)
  }

  const handleReject = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId))
    setSelectedComment(null)
  }

  const handleViewDetails = (comment: PendingComment) => {
    setSelectedComment(comment)
  }

  const getToxicityBadge = (score?: number) => {
    if (!score) return null
    
    let color = 'bg-green-100 text-green-800'
    let label = '正常'
    
    if (score >= 0.8) {
      color = 'bg-red-100 text-red-800'
      label = '高度不当'
    } else if (score >= 0.6) {
      color = 'bg-orange-100 text-orange-800'
      label = '可能不当'
    } else if (score >= 0.4) {
      color = 'bg-yellow-100 text-yellow-800'
      label = '轻微不当'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {label} ({Math.round(score * 100)}%)
      </span>
    )
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
            { key: 'all', label: '全部', count: comments.length },
            { key: 'pending', label: '待审核', count: comments.filter(c => !c.reportCount).length },
            { key: 'reported', label: '被举报', count: comments.filter(c => c.reportCount && c.reportCount > 0).length },
            { key: 'toxic', label: '不当内容', count: comments.filter(c => (c.toxicityScore || 0) > 0.7).length }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as 'all' | 'pending' | 'reported' | 'toxic')}
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

      {/* Comments list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredComments.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无待审核评论</h3>
              <p className="mt-1 text-sm text-gray-500">所有评论都已审核完成</p>
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  selectedComment?.id === comment.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleViewDetails(comment)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={comment.userAvatar || '/images/default-avatar.jpg'}
                    alt={comment.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-gray-900">
                            {comment.username}
                          </h4>
                          <span className="text-xs text-gray-500">
                            评论了 {comment.gameTitle}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {comment.createdAt}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex space-x-1">
                          {getToxicityBadge(comment.toxicityScore)}
                          {getReportBadge(comment.reportCount)}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApprove(comment.id)
                            }}
                            className="p-1 text-green-600 hover:text-green-800 rounded-md"
                            title="通过"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleReject(comment.id)
                            }}
                            className="p-1 text-red-600 hover:text-red-800 rounded-md"
                            title="删除"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment details */}
        <div className="bg-gray-50 rounded-lg p-6">
          {selectedComment ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">评论详情</h3>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={selectedComment.userAvatar || '/images/default-avatar.jpg'}
                      alt={selectedComment.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedComment.username}</h4>
                      <p className="text-sm text-gray-500">
                        评论了 {selectedComment.gameTitle} • {selectedComment.createdAt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">评论内容</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{selectedComment.content}</p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      {selectedComment.toxicityScore !== undefined && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">不当内容检测</label>
                          <div className="mt-1">
                            {getToxicityBadge(selectedComment.toxicityScore)}
                          </div>
                        </div>
                      )}

                      {selectedComment.reportCount && selectedComment.reportCount > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">举报信息</label>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-red-600">
                              举报次数: {selectedComment.reportCount}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {selectedComment.reportReasons?.map((reason, index) => (
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
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(selectedComment.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                  通过评论
                </button>
                <button
                  onClick={() => handleReject(selectedComment.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircleIcon className="mr-2 h-4 w-4" />
                  删除评论
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">选择评论查看详情</h3>
              <p className="mt-1 text-sm text-gray-500">点击左侧评论查看详细信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}