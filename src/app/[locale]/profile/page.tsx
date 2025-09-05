'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GameCard } from "@/components/GameCard"
import { Icons } from "@/components/ui/icons"
import { Game } from "@/lib/games"
import Image from "next/image"
import { Trophy, Target, TrendingUp, Clock } from "lucide-react"

interface UserProfile {
  username?: string
  avatar?: string
  favorite_games?: string[]
  play_history?: Array<{
    gameId: string
    lastPlayed: string
    playCount: number
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations('profile')
  const tAchievements = useTranslations('achievements')
  const [profile, setProfile] = useState<UserProfile>({})
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([])
  const [historyGames, setHistoryGames] = useState<Game[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [avatar, setAvatar] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchProfile()
      fetchFavoriteGames()
      fetchHistoryGames()
      fetchUserStats()
      fetchAchievements()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setUsername(data.username || "")
        setAvatar(data.avatar || "")
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const fetchFavoriteGames = async () => {
    try {
      const response = await fetch("/api/user/games?type=favorites")
      if (response.ok) {
        const data = await response.json()
        setFavoriteGames(data)
      }
    } catch (error) {
      console.error("Error fetching favorite games:", error)
    }
  }

  const fetchHistoryGames = async () => {
    try {
      const response = await fetch("/api/user/games?type=history")
      if (response.ok) {
        const data = await response.json()
        setHistoryGames(data)
      }
    } catch (error) {
      console.error("Error fetching history games:", error)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/achievements?type=stats")
      if (response.ok) {
        const data = await response.json()
        setUserStats(data)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/user/achievements?type=achievements")
      if (response.ok) {
        const data = await response.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error("Error fetching achievements:", error)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, avatar }),
      })

      if (response.ok) {
        setProfile({ ...profile, username, avatar })
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked).length

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        {/* Stats Overview */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">{t('stats.unlockedAchievements')}</p>
                    <p className="text-2xl font-bold">{unlockedAchievements}</p>
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
                    <p className="text-2xl font-bold">{formatTime(userStats.total_play_time)}</p>
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
                    <p className="text-2xl font-bold">{userStats.total_play_count}</p>
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
                    <p className="text-2xl font-bold">{userStats.current_streak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                {profile.avatar ? (
                  <Image 
                    src={profile.avatar} 
                    alt={profile.username || session.user.name || 'User avatar'}
                    width={80}
                    height={80}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Icons.user className="w-10 h-10 text-gray-500" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {profile.username || session.user.name}
                </h3>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">{t('form.username')}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('form.usernamePlaceholder')}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatar">{t('form.avatarUrl')}</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder={t('form.avatarPlaceholder')}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t('form.save')}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('form.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                {t('form.editProfile')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Favorite Games */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.favoriteGames')}</CardTitle>
            <CardDescription>
              {t('sections.favoriteDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">{t('noData.favoriteGames')}</p>
            )}
          </CardContent>
        </Card>

        {/* Play History */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.playHistory')}</CardTitle>
            <CardDescription>
              {t('sections.historyDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {historyGames.length > 0 ? (
              <div className="space-y-4">
                {historyGames.map((game) => (
                  <div key={game.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Image 
                      src={game.thumbnail} 
                      alt={game.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{game.name}</h4>
                      <p className="text-sm text-gray-600">
                        {t('gameInfo.lastPlayed', { date: new Date((game as Game & { lastPlayed?: string }).lastPlayed || '').toLocaleDateString() })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('gameInfo.playCount', { count: (game as Game & { playCount?: number }).playCount || 0 })}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => router.push(`/games/${game.slug}`)}>
                      {t('gameInfo.playAgain')}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">{t('noData.playHistory')}</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>{t('sections.recentAchievements')}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => router.push('/achievements')}>
                  {t('viewAll')}
                </Button>
              </CardTitle>
              <CardDescription>
                {t('sections.achievementsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.slice(0, 6).map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs font-medium ${
                            achievement.unlocked ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {achievement.unlocked ? tAchievements('status.unlocked') : tAchievements('status.locked')}
                          </span>
                          <span className="text-xs text-gray-500">
                            +{achievement.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}