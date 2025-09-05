'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/components/ui/toast';
import { FadeIn, StaggeredList } from '@/components/ui/animations';
import { 
  History, 
  Clock, 
  Play, 
  Trash2, 
  Calendar,
  TrendingUp,
  Gamepad2,
  RotateCcw
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface GameHistory {
  id: string;
  user_id: string;
  game_id: string;
  play_duration: number;
  session_count: number;
  last_played_at: string;
  first_played_at: string;
  games: {
    id: string;
    name: string;
    description: string;
    thumbnail_url: string;
    category: string;
    tags: string[];
    rating: number;
    play_count: number;
  };
}

interface HistoryStats {
  totalGames: number;
  totalPlayTime: number;
  totalSessions: number;
  averagePlayTime: number;
}

export default function GameHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations('gameHistory');
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/en/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      fetchHistory();
    }
  }, [status, page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/game-history?page=${page}&limit=12`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch game history');
      }

      const data = await response.json();
      
      if (page === 1) {
        setHistory(data.history);
        setStats(data.stats);
      } else {
        setHistory(prev => [...prev, ...data.history]);
      }
      
      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching game history:', error);
      toast.error('Error', t('error.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (gameId: string) => {
    if (!confirm(t('confirm.deleteGame'))) {
      return;
    }

    try {
      setDeletingId(gameId);
      const response = await fetch(`/api/user/game-history?gameId=${gameId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete game history');
      }

      setHistory(prev => prev.filter(item => item.game_id !== gameId));
      toast.success('Success', t('success.gameRemoved'));
      
      // 重新获取统计数据
      fetchStats();
    } catch (error) {
      console.error('Error deleting game history:', error);
      toast.error('Error', t('error.deleteFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllHistory = async () => {
    if (!confirm(t('confirm.clearAll'))) {
      return;
    }

    try {
      const response = await fetch('/api/user/game-history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_all' })
      });

      if (!response.ok) {
        throw new Error('Failed to clear game history');
      }

      setHistory([]);
      setStats(null);
      toast.success('Success', t('success.historyCleared'));
    } catch (error) {
      console.error('Error clearing game history:', error);
      toast.error('Error', t('error.clearFailed'));
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/user/game-history?page=1&limit=1');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatPlayTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            </div>
            {history.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAllHistory}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('actions.clearAll')}
              </Button>
            )}
          </div>
          <p className="text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <FadeIn duration={600} delay={100}>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('stats.totalGames')}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalGames}</p>
                    </div>
                    <Gamepad2 className="w-8 h-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn duration={600} delay={200}>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('stats.totalPlayTime')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPlayTime(stats.totalPlayTime)}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn duration={600} delay={300}>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('stats.totalSessions')}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                    </div>
                    <Play className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>

            <FadeIn duration={600} delay={400}>
              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('stats.averagePlayTime')}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPlayTime(stats.averagePlayTime)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        )}

        {/* Game History List */}
        {history.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('empty.title')}</h3>
            <p className="text-gray-600 mb-6">
              {t('empty.description')}
            </p>
            <Button onClick={() => router.push('/en/games')}>
              <Gamepad2 className="w-4 h-4 mr-2" />
              {t('empty.browseGames')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <StaggeredList>
              {history.map((item, index) => (
                <FadeIn key={item.id} duration={500} delay={index * 100}>
                  <Card className="bg-white hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Game Card */}
                        <div className="md:w-1/3">
                          <div 
                            className="cursor-pointer"
                            onClick={() => router.push(`/games/${item.games.id}`)}
                          >
                            <div className="relative group">
                              <img
                                src={item.games.thumbnail_url}
                                alt={item.games.name}
                                className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Game Info */}
                        <div className="md:w-2/3">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {item.games.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>
                                    {formatDistanceToNow(new Date(item.last_played_at), { addSuffix: true })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Play className="w-4 h-4" />
                                  <span>{t('info.sessions', { count: item.session_count })}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatPlayTime(item.play_duration)}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="secondary">{item.games.category}</Badge>
                                {item.games.tags.slice(0, 3).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteHistory(item.game_id)}
                              disabled={deletingId === item.game_id}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              {deletingId === item.game_id ? (
                                <RotateCcw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {item.games.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{t('info.firstPlayed', { date: formatDistanceToNow(new Date(item.first_played_at), { addSuffix: true }) })}</span>
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => router.push(`/games/${item.games.id}`)}
                            >
                              {t('actions.playAgain')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </StaggeredList>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading}
                >
                  {loading ? <Loading size="sm" /> : t('actions.loadMore')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}