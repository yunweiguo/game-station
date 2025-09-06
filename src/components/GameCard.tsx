'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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

  
  return (
    <Link href={`/games/${game.slug}`} className="group">
      <FadeIn duration={600}>
        <HoverLift lift={8} shadow={true}>
          <div className={cn(
            "bg-white rounded-xl shadow-lg overflow-hidden",
            "border border-gray-100",
            "relative",
            "aspect-video", // 保持宽高比
            className
          )}>
        {/* Image Container */}
        <div className="w-full h-full relative overflow-hidden bg-gray-100">
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
          
          {/* Gradient Overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Game Name Overlay - Only visible on hover */}
          <div className="absolute inset-0 flex items-end justify-center p-4">
            <div className="text-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <h3 className="text-white font-bold text-lg drop-shadow-lg">
                {game.name}
              </h3>
            </div>
          </div>

          {/* Play Button Overlay - Only visible on hover */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "bg-white/90 backdrop-blur-sm text-indigo-600 px-4 py-2 rounded-lg",
              "flex items-center gap-2 font-semibold shadow-lg",
              "transform scale-0 group-hover:scale-100 transition-all duration-300",
              "hover:bg-white hover:scale-105"
            )}>
              <Play className="w-4 h-4" />
              <span className="text-sm">Play</span>
            </div>
          </div>

          {/* Favorite Button - Always visible if enabled */}
          {showFavoriteButton && (
            <ScaleIn duration={400}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "absolute top-3 right-3 backdrop-blur-sm",
                  "bg-white/90 hover:bg-white text-gray-700",
                  "w-8 h-8 p-0 rounded-full shadow-md",
                  "transition-all duration-200 hover:scale-110"
                )}
                onClick={handleFavoriteToggle}
                disabled={isLoading}
              >
                <Pulse duration={2000} intensity={1.1} className={localIsFavorite ? '' : 'hidden'}>
                  <Heart 
                    className={cn(
                      "w-4 h-4 transition-all duration-200",
                      "fill-red-500 text-red-500 scale-110"
                    )} 
                  />
                </Pulse>
                <Heart 
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    localIsFavorite && "fill-red-500 text-red-500 scale-110"
                  )} 
                />
              </Button>
            </ScaleIn>
          )}
        </div>
          </div>
        </HoverLift>
      </FadeIn>
    </Link>
  );
}