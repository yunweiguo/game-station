'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameCard } from './GameCard';
import { GameListSkeleton } from './ui/skeleton';
import { Loading } from './ui/loading';
import { ErrorBoundary } from './ErrorBoundary';
import { toast } from './ui/toast';
import { Button } from './ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail: string;
  playCount: number;
  rating: number;
  tags?: string[];
  category?: string;
  featured?: boolean;
  new?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface GameListProps {
  games: Game[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  showFavoriteButton?: boolean;
  favorites?: Set<string>;
  onFavoriteToggle?: (gameId: string, isFavorite: boolean) => void;
  emptyMessage?: string;
  className?: string;
}

export function GameList({
  games,
  loading = false,
  error = null,
  onRetry,
  showFavoriteButton = false,
  favorites = new Set(),
  onFavoriteToggle,
  emptyMessage = 'No games found',
  className
}: GameListProps) {
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(favorites);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleFavoriteToggle = (gameId: string, isFavorite: boolean) => {
    const newFavorites = new Set(localFavorites);
    if (isFavorite) {
      newFavorites.add(gameId);
    } else {
      newFavorites.delete(gameId);
    }
    setLocalFavorites(newFavorites);
    onFavoriteToggle?.(gameId, isFavorite);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    onRetry?.();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load games
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {error}
        </p>
        {onRetry && (
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry {retryCount > 0 && `(${retryCount})`}
          </Button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <Loading 
            text="Loading games..." 
            subtext="Please wait a moment"
            spinnerProps={{ size: 'lg', variant: 'dots' }}
          />
        </div>
        <GameListSkeleton count={8} />
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Try adjusting your filters or check back later for new games.
        </p>
        {onRetry && (
          <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <ErrorBoundary key={game.id}>
          <GameCard
            game={game}
            showFavoriteButton={showFavoriteButton}
            isFavorite={localFavorites.has(game.id)}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </ErrorBoundary>
      ))}
    </div>
  );
}

interface GameListContainerProps {
  fetchGames: () => Promise<Game[]>;
  showFavoriteButton?: boolean;
  favorites?: Set<string>;
  onFavoriteToggle?: (gameId: string, isFavorite: boolean) => void;
  emptyMessage?: string;
  className?: string;
  retryInterval?: number;
}

export function GameListContainer({
  fetchGames,
  showFavoriteButton = false,
  favorites = new Set(),
  onFavoriteToggle,
  emptyMessage,
  className,
  retryInterval = 5000
}: GameListContainerProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedGames = await fetchGames();
      setGames(fetchedGames);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load games';
      setError(errorMessage);
      toast.error('Failed to load games', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchGames]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Auto-retry on error
  useEffect(() => {
    if (error && retryInterval > 0) {
      const timer = setTimeout(loadGames, retryInterval);
      return () => clearTimeout(timer);
    }
  }, [error, retryInterval, loadGames]);

  return (
    <GameList
      games={games}
      loading={loading}
      error={error}
      onRetry={loadGames}
      showFavoriteButton={showFavoriteButton}
      favorites={favorites}
      onFavoriteToggle={onFavoriteToggle}
      emptyMessage={emptyMessage}
      className={className}
    />
  );
}