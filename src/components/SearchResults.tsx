import { GameCard } from '@/components/GameCard';
import { advancedSearchGames, AdvancedSearchFilters } from '@/lib/games';
import { getTranslations } from 'next-intl/server';

interface SearchResultsProps {
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

export async function SearchResults({ query, searchParams }: SearchResultsProps) {
  const t = await getTranslations('games');
  
  // Build search filters
  const filters: AdvancedSearchFilters = {
    query,
    category: searchParams?.category,
    tags: searchParams?.tags ? searchParams.tags.split(',') : [],
    minRating: searchParams?.minRating ? parseFloat(searchParams.minRating) : undefined,
    maxRating: searchParams?.maxRating ? parseFloat(searchParams.maxRating) : undefined,
    sortBy: (searchParams?.sortBy as 'relevance' | 'rating' | 'play_count' | 'created_at') || 'relevance',
    sortOrder: (searchParams?.sortOrder as 'asc' | 'desc') || 'desc',
    difficulty: searchParams?.difficulty as 'easy' | 'medium' | 'hard',
    featured: searchParams?.featured === 'true',
    popular: searchParams?.popular === 'true',
    new: searchParams?.new === 'true',
  };

  const games = await advancedSearchGames(filters);

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