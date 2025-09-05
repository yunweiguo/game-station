import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import { GameIframe } from '@/components/GameIframe';
import { getGameBySlug, getRelatedGames } from '@/lib/games';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Gamepad2, Tag, Clock, Eye } from 'lucide-react';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const t = await getTranslations('gameDetail');
  const game = await getGameBySlug(slug);
  
  if (!game) {
    notFound();
  }

  const relatedGames = await getRelatedGames(game.category_id, game.id);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        {/* Game Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-4 mb-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('back')}
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Game Info */}
              <div className="lg:col-span-1">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
                  <Image
                    src={game.thumbnail}
                    alt={game.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {game.name}
                </h1>
                
                <p className="text-gray-600 mb-6">
                  {game.description}
                </p>
                
                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{game.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {t('playCount', { count: game.playCount })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {game.play_count} views
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Updated {new Date(game.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Tags */}
                {game.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      {t('tags')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {game.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Play Button */}
                <Link 
                  href={`/games/${game.slug}/play`}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <Gamepad2 className="w-5 h-5" />
                  {t('playNow')}
                </Link>
              </div>
              
              {/* Game Player */}
              <div className="lg:col-span-2">
                <GameIframe game={game} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Games */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('relatedGames')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedGames.map((relatedGame) => (
              <GameCard key={relatedGame.id} game={relatedGame} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}