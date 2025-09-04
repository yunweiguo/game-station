import { GameCard } from '@/components/GameCard';
import { searchGames } from '@/lib/games';
import { getTranslations } from 'next-intl/server';

interface SearchResultsProps {
  query: string;
}

export async function SearchResults({ query }: SearchResultsProps) {
  const t = await getTranslations('games');
  
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

  const games = await searchGames(query);

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