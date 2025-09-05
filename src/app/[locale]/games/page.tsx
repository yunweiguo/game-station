import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameCard } from '@/components/GameCard';
import { getAllGames, getGamesByCategory } from '@/lib/games';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { GameFilters } from '@/components/GameFilters';

interface GamesPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const params = await searchParams;
  const t = await getTranslations('games');
  
  let games;
  if (params.category) {
    games = await getGamesByCategory(params.category);
  } else {
    games = await getAllGames();
  }

  // Apply search filter if provided
  if (params.search) {
    games = games.filter(game => 
      game.name.toLowerCase().includes(params.search!.toLowerCase()) ||
      game.description.toLowerCase().includes(params.search!.toLowerCase()) ||
      game.tags.some(tag => tag.toLowerCase().includes(params.search!.toLowerCase()))
    );
  }

  // Apply sorting
  if (params.sort) {
    switch (params.sort) {
      case 'popular':
        games.sort((a, b) => b.playCount - a.playCount);
        break;
      case 'newest':
        games.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'rating':
        games.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-gray-600">
            Browse our collection of free online H5 games
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <GameFilters />
            </Suspense>
          </div>

          {/* Games Grid */}
          <div className="lg:col-span-3">
            {games.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('noGamesFound')}
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}