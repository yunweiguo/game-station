'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, Target, Star, Bell, CheckCircle, TrendingUp, Award, Lock } from 'lucide-react'
import { useSession } from "next-auth/react"

interface Achievement {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  points: number
  category: string
  requirement_type: string
  requirement_value: number
  hidden: boolean
  unlocked?: boolean
  progress?: number
  unlockedAt?: string
}

interface UserStats {
  total_play_time: number
  total_games_played: number
  total_play_count: number
  current_streak: number
  best_streak: number
  longest_session: number
  last_played_at: string
}

interface Notification {
  id: string
  achievement: Achievement
  message: string
  read: boolean
  created_at: string
}

export default function AchievementsPage() {
  const { data: session } = useSession()
  const t = useTranslations('achievements')
  const tProfile = useTranslations('profile')
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('achievements')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [achievementsRes, statsRes, notificationsRes] = await Promise.all([
        fetch('/api/user/achievements?type=achievements'),
        fetch('/api/user/achievements?type=stats'),
        fetch('/api/user/achievements?type=notifications')
      ])

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json()
        setAchievements(achievementsData || [])
      } else {
        setError(t('error.title'))
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json()
        setNotifications(notificationsData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(t('error.message'))
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getProgressPercentage = (achievement: Achievement) => {
    if (!achievement.progress) return 0
    return Math.min((achievement.progress / achievement.requirement_value) * 100, 100)
  }

  const getProgressText = (achievement: Achievement) => {
    if (!achievement.progress) return '0/' + achievement.requirement_value
    return `${Math.min(achievement.progress, achievement.requirement_value)}/${achievement.requirement_value}`
  }

  const getLocalizedText = (key: string, params?: any) => {
    return t(key, params)
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0)
  const lockedAchievements = achievements.filter(a => !a.unlocked && a.progress === 0)
  const unreadNotifications = notifications.filter(n => !n.read)

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('loginRequired.title')}</h1>
        <p className="text-gray-600">{t('loginRequired.message')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('error.title')}</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchData}>{t('error.retry')}</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* 统计概览 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.unlockedAchievements')}</p>
                  <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.totalPlayTime')}</p>
                  <p className="text-2xl font-bold">{formatTime(stats.total_play_time)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.playCount')}</p>
                  <p className="text-2xl font-bold">{stats.total_play_count}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('stats.currentStreak')}</p>
                  <p className="text-2xl font-bold">{stats.current_streak}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">{t('tabs.achievements')}</TabsTrigger>
          <TabsTrigger value="stats">{t('tabs.statistics')}</TabsTrigger>
          <TabsTrigger value="notifications">
            {t('tabs.notifications')}
            {unreadNotifications.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 text-xs">
                {unreadNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Unlocked Achievements ({unlockedAchievements.length})</CardTitle>
                <CardDescription>Achievements you have earned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <Card key={achievement.id} className="border-yellow-200 bg-yellow-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-yellow-800">{achievement.name}</h3>
                            <p className="text-sm text-yellow-600">{achievement.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-yellow-600">+{achievement.points} points</span>
                            </div>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* In Progress Achievements */}
          {inProgressAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>In Progress ({inProgressAchievements.length})</CardTitle>
                <CardDescription>Achievements you're working on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inProgressAchievements.map((achievement) => (
                    <Card key={achievement.id} className="border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress</span>
                                <span>{getProgressText(achievement)}</span>
                              </div>
                              <Progress value={getProgressPercentage(achievement)} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Locked ({lockedAchievements.length})</CardTitle>
                <CardDescription>Achievements you haven't unlocked yet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedAchievements.map((achievement) => (
                    <Card key={achievement.id} className="border-gray-200 opacity-60">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl grayscale">{achievement.icon}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                            <div className="mt-2">
                              <div className="text-xs text-gray-500">
                                Requires: {achievement.requirement_value} {achievement.requirement_type === 'games_played' ? 'games' : 'plays'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {achievements.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No achievement data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gaming Statistics</CardTitle>
                  <CardDescription>Your gaming data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Play Time</span>
                    <span className="font-semibold">{formatTime(stats.total_play_time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Play Count</span>
                    <span className="font-semibold">{stats.total_play_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Longest Session</span>
                    <span className="font-semibold">{formatTime(stats.longest_session)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Streak</span>
                    <span className="font-semibold">{stats.current_streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Best Streak</span>
                    <span className="font-semibold">{stats.best_streak} days</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievement Progress</CardTitle>
                  <CardDescription>Your achievement completion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Achievements</span>
                    <span className="font-semibold">{achievements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unlocked</span>
                    <span className="font-semibold">{unlockedAchievements.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold">
                      {achievements.length > 0 ? Math.round((unlockedAchievements.length / achievements.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points</span>
                    <span className="font-semibold">
                      {unlockedAchievements.reduce((sum, a) => sum + a.points, 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No statistics data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievement Notifications</CardTitle>
              <CardDescription>
                You have {notifications.length} notifications
                {unreadNotifications.length > 0 && ` (${unreadNotifications.length} unread)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{notification.achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{notification.achievement.name}</h3>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                            {!notification.read && (
                              <Badge variant="outline">Unread</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No notifications available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}