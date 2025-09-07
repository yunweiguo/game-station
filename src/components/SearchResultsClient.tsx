'use client';

import { GameCard } from '@/components/GameCard';
import { advancedSearchGames, AdvancedSearchFilters, Game } from '@/lib/games';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface SearchResultsClientProps {
  query: string;
  searchParams?: {
    category?: string;
    tags?: string;
    minRating?: string;
    maxRating?: string;
    sortBy?: string;
    sortOrder?: string;
    difficulty?: string;
    featured?: string;
    popular?: string;
    new?: string;
  };
}

export function SearchResultsClient({ query, searchParams }: SearchResultsClientProps) {
  const t = useTranslations('games');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      
      // Build search filters
      const filters: AdvancedSearchFilters = {
        query,
        category: searchParams?.category && searchParams.category !== 'all' ? searchParams.category : undefined,
        tags: searchParams?.tags ? searchParams.tags.split(',') : [],
        minRating: searchParams?.minRating ? parseFloat(searchParams.minRating) : undefined,
        maxRating: searchParams?.maxRating ? parseFloat(searchParams.maxRating) : undefined,
        sortBy: (searchParams?.sortBy as 'relevance' | 'rating' | 'play_count' | 'created_at') || 'relevance',
        sortOrder: (searchParams?.sortOrder as 'asc' | 'desc') || 'desc',
        difficulty: searchParams?.difficulty && searchParams.difficulty !== 'any' ? (searchParams.difficulty as 'easy' | 'medium' | 'hard') : undefined,
        featured: searchParams?.featured === 'true',
        popular: searchParams?.popular === 'true',
        new: searchParams?.new === 'true',
      };

      try {
        const results = await advancedSearchGames(filters);
        setGames(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [query, searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Search for Games
        </h3>
        <p className="text-gray-600">
          Enter a game name, category, or keyword to find your favorite games
        </p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('noGamesFound')}
        </h3>
        <p className="text-gray-600">
          No games found matching &quot;{query}&quot;. Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}