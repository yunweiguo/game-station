'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GameCard } from "@/components/GameCard"
import { Icons } from "@/components/ui/icons"
import { Game } from "@/lib/games"
import Image from "next/image"

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
  const [profile, setProfile] = useState<UserProfile>({})
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([])
  const [historyGames, setHistoryGames] = useState<Game[]>([])
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

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your account information and preferences
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
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Enter avatar URL"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Favorite Games */}
        <Card>
          <CardHeader>
            <CardTitle>Favorite Games</CardTitle>
            <CardDescription>
              Games you&apos;ve marked as favorites
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
              <p className="text-gray-500">No favorite games yet. Start adding some!</p>
            )}
          </CardContent>
        </Card>

        {/* Play History */}
        <Card>
          <CardHeader>
            <CardTitle>Play History</CardTitle>
            <CardDescription>
              Recently played games
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
                        Last played: {new Date((game as Game & { lastPlayed?: string }).lastPlayed || '').toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Play count: {(game as Game & { playCount?: number }).playCount || 0}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => router.push(`/games/${game.slug}`)}>
                      Play Again
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No play history yet. Start playing some games!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}