'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';

interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string;
  tags: string[];
}

interface GameContent {
  content: {
    about: {
      title: string;
      description: string;
    };
  };
  breadcrumbs: {
    category: string;
    gameName: string;
  };
  gameName: string;
}
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { GameCard } from '@/components/GameCard';
import { GameIframe } from '@/components/GameIframe';
import { GameAbout } from '@/components/GameAbout';
import { getGameBySlug, getRelatedGames } from '@/lib/games';
import { getGameContentConfig } from '@/config/games';
import Image from 'next/image';
import Link from 'next/link';
import { Gamepad2, RefreshCw, Maximize } from 'lucide-react';
// import { FadeIn } from '@/components/ui/animations';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function GamePage({ params }: GamePageProps) {
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [gameContent, setGameContent] = useState<GameContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const gameData = await getGameBySlug(slug);
        if (!gameData) {
          notFound();
        }
        setGame(gameData);
        
        const related = await getRelatedGames(gameData.category_id, gameData.id);
        setRelatedGames(related);

        // Get game content configuration - map database slug to config key
        let configKey = slug;
        
        // Map database slugs to configuration keys if needed
        const slugMapping: Record<string, string> = {
          '2048': '2048',
          'minesweeper': 'minesweeper-classic',
          'solitaire': 'solitaire-classic',
        };
        
        if (slugMapping[slug]) {
          configKey = slugMapping[slug];
        }
        
        const contentConfig = getGameContentConfig(configKey);
        console.log('Content config for', configKey, ':', contentConfig);
        setGameContent(contentConfig);
      } catch (error) {
        console.error('Error fetching game:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const refreshGame = () => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const toggleFullscreen = () => {
    const iframe = document.querySelector('iframe');
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!game) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section with Featured Game */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Gamepad2 className="w-8 h-8 text-yellow-400" />
                <span className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-sm font-semibold">
                  FEATURED GAME
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {game.name}
              </h1>
              <p className="text-xl text-blue-100">
                {game.description}
              </p>
            </div>

            {/* Game Container */}
            <div className="max-w-5xl mx-auto">
              {/* Game Player */}
              <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
                {/* Main Game Area - Larger height for better gameplay */}
                <div className="aspect-[4/3] bg-black">
                  <GameIframe game={{
                    id: game.id,
                    name: game.name,
                    iframe_url: (game as Game & { iframe_url?: string }).iframe_url || '',
                    slug: game.slug
                  }} />
                </div>
                
                {/* Game Controls Overlay */}
                <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">Now Playing: {game.name}</span>
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
                        title="Fullscreen"
                      >
                        <Maximize className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Info Below Game */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Game Description */}
                  <div>
                    <h2 className="text-2xl font-bold mb-3">{game.name}</h2>
                    <p className="text-blue-100 leading-relaxed">
                      {game.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {game.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <div className="space-y-4">
                    <Link 
                      href={`/games/${game.slug}/play`}
                      className="inline-flex items-center gap-3 bg-yellow-400 text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      Play Full Screen
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game About Section - temporarily disabled due to type issues */}
        {false && gameContent && (
          <div>About section will be enabled after fixing type definitions</div>
        )}
  
        {/* Other Games Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                More Games You Might Like
              </h2>
              <p className="text-xl text-gray-600">
                Discover other exciting games similar to {gameContent?.gameName || game?.name}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedGames.slice(0, 8).map((relatedGame) => (
                <div key={relatedGame.id}>
                  <GameCard game={{
                    ...relatedGame,
                    thumbnail: (relatedGame as Game & { thumbnail?: string }).thumbnail || '/images/default-game.jpg',
                    playCount: (relatedGame as Game & { playCount?: number }).playCount || (relatedGame as Game & { play_count?: number }).play_count || 0,
                    rating: (relatedGame as Game & { rating?: number }).rating || 0
                  }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}