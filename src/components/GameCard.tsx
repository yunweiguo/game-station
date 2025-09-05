'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Star, Play, Heart, Clock, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/toast';
import { FadeIn, HoverLift, ScaleIn, Pulse } from '@/components/ui/animations';

interface GameCardProps {
  game: {
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
  };
  showFavoriteButton?: boolean;
  isFavorite?: boolean;
  onFavoriteToggle?: (gameId: string, isFavorite: boolean) => void;
  className?: string;
}

export function GameCard({ 
  game, 
  showFavoriteButton = false, 
  isFavorite = false, 
  onFavoriteToggle,
  className 
}: GameCardProps) {
  const { data: session } = useSession();
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      // Redirect to sign in if not authenticated
      window.location.href = '/auth/signin';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: game.id,
          action: localIsFavorite ? 'remove' : 'add',
          type: 'favorite'
        }),
      });

      if (response.ok) {
        const newIsFavorite = !localIsFavorite;
        setLocalIsFavorite(newIsFavorite);
        onFavoriteToggle?.(game.id, newIsFavorite);
        toast.success(
          newIsFavorite ? 'Added to favorites' : 'Removed from favorites',
          `${game.name} ${newIsFavorite ? 'added to' : 'removed from'} your favorites`
        );
      } else {
        toast.error('Failed to update favorites', 'Please try again later');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Network error', 'Failed to update favorites. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPlayCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <Link href={`/games/${game.slug}`} className="group">
      <FadeIn duration={600}>
        <HoverLift lift={8} shadow={true}>
          <div className={cn(
            "bg-white rounded-xl shadow-lg overflow-hidden",
            "border border-gray-100",
            "relative",
            className
          )}>
        {/* Image Container with Overlay */}
        <div className="aspect-video relative overflow-hidden bg-gray-100">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          
          {/* Game Image */}
          <Image
            src={imageError ? '/placeholder-game.jpg' : game.thumbnail}
            alt={game.name}
            width={400}
            height={225}
            className={cn(
              "w-full h-full object-cover",
              "group-hover:scale-110 transition-transform duration-700",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              toast.error('Image failed to load', `Failed to load image for ${game.name}`);
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "bg-indigo-600 text-white px-6 py-3 rounded-xl",
              "flex items-center gap-2 font-semibold shadow-lg",
              "transform scale-0 group-hover:scale-100 transition-all duration-300",
              "hover:bg-indigo-700 hover:scale-105"
            )}>
              <Play className="w-5 h-5" />
              <span>Play Now</span>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {game.featured && (
              <Badge variant="secondary" className="bg-amber-500 text-white border-amber-600">
                <Trophy className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {game.new && (
              <Badge variant="secondary" className="bg-emerald-500 text-white border-emerald-600">
                New
              </Badge>
            )}
            {game.difficulty && (
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium backdrop-blur-sm bg-white/90", getDifficultyColor(game.difficulty))}
              >
                {game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)}
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          {showFavoriteButton && (
            <ScaleIn duration={400}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "absolute top-3 right-3 backdrop-blur-sm",
                  "bg-white/90 hover:bg-white text-gray-700",
                  "w-10 h-10 p-0 rounded-full shadow-md",
                  "transition-all duration-200 hover:scale-110"
                )}
                onClick={handleFavoriteToggle}
                disabled={isLoading}
              >
                <Pulse duration={2000} intensity={1.1} className={localIsFavorite ? '' : 'hidden'}>
                  <Heart 
                    className={cn(
                      "w-5 h-5 transition-all duration-200",
                      "fill-red-500 text-red-500 scale-110"
                    )} 
                  />
                </Pulse>
                <Heart 
                  className={cn(
                    "w-5 h-5 transition-all duration-200",
                    localIsFavorite && "fill-red-500 text-red-500 scale-110"
                  )} 
                />
              </Button>
            </ScaleIn>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-3 right-3 backdrop-blur-sm bg-black/80 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{game.rating}</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {game.name}
          </h3>
          
          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {game.description}
          </p>
          
          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {game.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200"
                >
                  {tag}
                </Badge>
              ))}
              {game.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 border-gray-200">
                  +{game.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Gamepad2 className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">{formatPlayCount(game.playCount)} plays</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{game.rating}</span>
            </div>
          </div>
        </div>
          </div>
        </HoverLift>
      </FadeIn>
    </Link>
  );
}