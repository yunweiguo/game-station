'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameCard } from '@/components/GameCard';
import { getFeaturedGames, getPopularGames } from '@/lib/games';
import { getGameContentConfig } from '@/config/games';
import { FadeIn } from '@/components/ui/animations';
import { GameAbout } from '@/components/GameAbout';
import { SEO } from '@/components/SEO';
import { Gamepad2, Play, RefreshCw, Maximize } from 'lucide-react';
import Link from 'next/link';

interface Game {
  id: string;
  slug: string;
  title: string;
  name: string;
  description: string;
  thumbnail: string;
  iframe_url: string;
  category_id: string;
  tags: string[];
  rating: number;
  play_count: number;
  playCount: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
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

export default function HomePage() {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [gameContent, setGameContent] = useState<GameContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured] = await Promise.all([
          getFeaturedGames(),
          getPopularGames()
        ]);
        setFeaturedGames(featured);
        
        // Set the first featured game as the main featured game
        if (featured && featured.length > 0) {
          setFeaturedGame(featured[0]);
          
          // Get game content configuration for the featured game
          const contentConfig = getGameContentConfig(featured[0].slug);
          setGameContent(contentConfig);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading || !featuredGame) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing games...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO />
      <Navigation />
      
      <main className="flex-grow">
        {/* Hero Section with Featured Game */}
        <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <FadeIn duration={600}>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Gamepad2 className="w-8 h-8 text-yellow-400" />
                  <span className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-sm font-semibold">
                    FEATURED GAME
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {featuredGame.name}
                </h1>
                <p className="text-xl text-blue-100">
                  {featuredGame.description}
                </p>
              </FadeIn>
            </div>

            {/* Game Container */}
            <div className="max-w-5xl mx-auto">
              <FadeIn duration={800}>
                {/* Game Player */}
                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
                  {/* Main Game Area - Larger height for better gameplay */}
                  <div className="aspect-[4/3] bg-black">
                    <iframe
                      src={featuredGame.iframe_url}
                      className="w-full h-full border-0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-pointer-lock"
                      title={`Play ${featuredGame.name}`}
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
                    />
                  </div>
                  
                  {/* Game Controls Overlay */}
                  <div className="absolute top-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-white" />
                        <span className="text-white font-medium">Now Playing: {featuredGame.name}</span>
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
                      <h2 className="text-2xl font-bold mb-3">{featuredGame.name}</h2>
                      <p className="text-blue-100 leading-relaxed">
                        {featuredGame.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {featuredGame.tags.map((tag) => (
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
                  <Link 
                    href={`/games/${featuredGame.slug}/play`}
                    className="inline-flex items-center gap-3 bg-yellow-400 text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Play Full Screen
                  </Link>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Game About Section */}
        {gameContent && (
          <GameAbout 
            gameSlug={featuredGame.slug}
            content={gameContent.content}
            breadcrumbs={gameContent.breadcrumbs}
          />
        )}

  
        {/* Other Games Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn duration={600}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  More Games You Might Like
                </h2>
                <p className="text-xl text-gray-600">
                  Discover other exciting games similar to {gameContent?.gameName || featuredGame?.name}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredGames.slice(0, 8).map((game, index) => (
                  <FadeIn key={game.id} duration={500} delay={index * 100}>
                    <GameCard game={game} />
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        </main>
      
      <Footer />
    </div>
  );
}