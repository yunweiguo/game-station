import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'favorites' or 'history'

    if (type === 'favorites') {
      const { data: favorites, error } = await supabase
        .from('user_profiles')
        .select('favorite_games')
        .eq('id', session.user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Get full game details for favorites
      if (favorites?.favorite_games?.length > 0) {
        const { data: games, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .in('id', favorites.favorite_games)
          .eq('status', 'active')

        if (gamesError) {
          return NextResponse.json({ error: gamesError.message }, { status: 500 })
        }

        return NextResponse.json(games)
      }

      return NextResponse.json([])
    }

    if (type === 'history') {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('play_history')
        .eq('id', session.user.id)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Get game details for history
      const historyGames = profile?.play_history || []
      if (historyGames.length > 0) {
        const gameIds = historyGames.map((h: { gameId: string }) => h.gameId)
        const { data: games, error: gamesError } = await supabase
          .from('games')
          .select('*')
          .in('id', gameIds)
          .eq('status', 'active')

        if (gamesError) {
          return NextResponse.json({ error: gamesError.message }, { status: 500 })
        }

        // Merge with play history data
        const gamesWithHistory = games.map(game => {
          const historyEntry = historyGames.find((h: { gameId: string }) => h.gameId === game.id)
          return {
            ...game,
            lastPlayed: historyEntry?.lastPlayed,
            playCount: historyEntry?.playCount || 0
          }
        })

        return NextResponse.json(gamesWithHistory)
      }

      return NextResponse.json([])
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
  } catch (error) {
    console.error('Error fetching user games:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gameId, action, type } = await request.json()

    if (type === 'favorite') {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('favorite_games')
        .eq('id', session.user.id)
        .single()

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
      }

      const currentFavorites = currentProfile?.favorite_games || []
      let updatedFavorites

      if (action === 'add') {
        updatedFavorites = [...currentFavorites, gameId]
      } else if (action === 'remove') {
        updatedFavorites = currentFavorites.filter((id: string) => id !== gameId)
      } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({ favorite_games: updatedFavorites })
        .eq('id', session.user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(profile)
    }

    if (type === 'history') {
      const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('play_history')
        .eq('id', session.user.id)
        .single()

      if (fetchError) {
        return NextResponse.json({ error: fetchError.message }, { status: 500 })
      }

      const currentHistory = currentProfile?.play_history || []
      let updatedHistory

      const existingEntryIndex = currentHistory.findIndex((h: { gameId: string }) => h.gameId === gameId)
      
      if (existingEntryIndex >= 0) {
        // Update existing entry
        updatedHistory = [...currentHistory]
        updatedHistory[existingEntryIndex] = {
          gameId,
          lastPlayed: new Date().toISOString(),
          playCount: (updatedHistory[existingEntryIndex].playCount || 0) + 1
        }
      } else {
        // Add new entry
        updatedHistory = [
          ...currentHistory,
          {
            gameId,
            lastPlayed: new Date().toISOString(),
            playCount: 1
          }
        ]
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .update({ play_history: updatedHistory })
        .eq('id', session.user.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json(profile)
    }

    return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
  } catch (error) {
    console.error('Error updating user games:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}