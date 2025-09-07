'use client';

import { useState, useEffect, use } from 'react';
import { Gamepad2, ArrowLeft, Star, Eye, Clock, Tag, Maximize, Minimize, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getGameBySlug, getRelatedGames, Game } from '@/lib/games';
import { GameCard } from '@/components/GameCard';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function GamePlayPage({ params }: GamePageProps) {
  const { slug } = use(params);
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const gameData = await getGameBySlug(slug);
        if (gameData) {
          setGame(gameData);
          
          // 记录游戏播放
          await fetch('/api/games/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              gameId: gameData.id,
              action: 'play'
            }),
          });
          
          // 获取相关游戏
          const related = await getRelatedGames(gameData.category_id, gameData.id);
          setRelatedGames(related);
        }
      } catch (error) {
        console.error('Error fetching game:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();
  }, [slug]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshGame = () => {
    const iframe = document.getElementById(`game-iframe-${game?.id}`) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Game Not Found</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Game Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/games/${game.slug}`}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Details
              </Link>
              <div className="h-4 w-px bg-gray-600"></div>
              <h1 className="text-xl font-bold text-white">{game.name}</h1>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{game.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{game.play_count} plays</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Player */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'min-h-screen'}`}>
        {/* Game Controls */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Now Playing: {game.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={refreshGame}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title="Refresh game"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Game iframe */}
        <div className="relative bg-black" style={{ height: isFullscreen ? '100vh' : '80vh' }}>
          <iframe
            id={`game-iframe-${game.id}`}
            src={game.iframe_url}
            className="w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={`Play ${game.name}`}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
          />
        </div>

        {/* Game Info Overlay (only in non-fullscreen mode) */}
        {!isFullscreen && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <Image
                    src={game.thumbnail}
                    alt={game.name}
                    width={120}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{game.name}</h2>
                  <p className="text-gray-300 mb-3">{game.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{game.rating} Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{game.play_count} Plays</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(game.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {game.tags && game.tags.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div className="flex gap-2">
                        {game.tags.map((tag: string) => (
                          <span 
                            key={tag}
                            className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Games (only in non-fullscreen mode) */}
      {!isFullscreen && relatedGames.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-6">More Games Like This</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.map((relatedGame) => (
                <GameCard key={relatedGame.id} game={relatedGame} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}