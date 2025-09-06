'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameCard } from '@/components/GameCard';
import { getFeaturedGames, getPopularGames } from '@/lib/games';
import { FadeIn } from '@/components/ui/animations';
import { currentConfig } from '@/config/homepage';
import { SEO } from '@/components/SEO';
import { Gamepad2, Star, Play, Clock, Eye, Tag, CheckCircle, Lightbulb, Trophy, RefreshCw, Maximize } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [popularGames, setPopularGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { featuredGame, content, otherGames, seo } = currentConfig;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, popular] = await Promise.all([
          getFeaturedGames(),
          getPopularGames()
        ]);
        setFeaturedGames(featured);
        setPopularGames(popular);
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

  if (isLoading) {
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Game Info */}
              <div className="space-y-6">
                <FadeIn duration={800}>
                  <div className="flex items-center gap-3 mb-4">
                    <Gamepad2 className="w-8 h-8 text-yellow-400" />
                    <span className="bg-yellow-400 text-indigo-900 px-3 py-1 rounded-full text-sm font-semibold">
                      FEATURED GAME
                    </span>
                  </div>
                  <h1 className="text-5xl font-bold mb-4">
                    {content.heroTitle}
                  </h1>
                  <p className="text-xl text-blue-100 mb-6">
                    {content.heroSubtitle}
                  </p>
                  <p className="text-lg text-blue-50 mb-8 leading-relaxed">
                    {featuredGame.description}
                  </p>
                  
                  {/* Game Stats */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{featuredGame.rating} Rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span className="font-semibold">{featuredGame.play_count.toLocaleString()} Plays</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Updated Daily</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredGame.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* CTA Button */}
                  <Link 
                    href={`/games/${featuredGame.slug}/play`}
                    className="inline-flex items-center gap-3 bg-yellow-400 text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Play className="w-6 h-6" />
                    Play Now - Free!
                  </Link>
                </FadeIn>
              </div>
              
              {/* Game Player */}
              <div className="relative">
                <FadeIn duration={800} delay={200}>
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
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
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-indigo-900 rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
                    FREE
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-green-400 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold shadow-lg">
                    <Trophy className="w-8 h-8" />
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {/* Game Instructions */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FadeIn duration={600}>
                <div className="bg-indigo-50 rounded-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-indigo-600" />
                    How to Play
                  </h2>
                  <ul className="space-y-3">
                    {content.gameInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
              
              <FadeIn duration={600} delay={200}>
                <div className="bg-purple-50 rounded-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-purple-600" />
                    Pro Tips
                  </h2>
                  <ul className="space-y-3">
                    {content.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Game Features */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn duration={600}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Why Play {featuredGame.name}?
                </h2>
                <p className="text-xl text-gray-600">
                  Discover the amazing features that make this game so addictive
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {content.gameFeatures.map((feature, index) => (
                  <FadeIn key={index} duration={500} delay={index * 100}>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.split(' ')[0]} {feature.split(' ')[1]}
                      </h3>
                      <p className="text-gray-600">
                        {feature}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Other Games Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn duration={600}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {otherGames.title}
                </h2>
                <p className="text-xl text-gray-600">
                  {otherGames.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredGames.slice(0, otherGames.limit).map((game, index) => (
                  <FadeIn key={game.id} duration={500} delay={index * 100}>
                    <GameCard game={game} />
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn duration={600}>
              <h2 className="text-4xl font-bold mb-6">
                Ready to Play?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {content.callToAction}
              </p>
              <Link 
                href={`/games/${featuredGame.slug}/play`}
                className="inline-flex items-center gap-3 bg-yellow-400 text-indigo-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
              >
                <Play className="w-6 h-6" />
                Play {featuredGame.name} Now
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}