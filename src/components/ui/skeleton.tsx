import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-gray-200", className)} />
  );
}

interface GameCardSkeletonProps {
  className?: string;
}

export function GameCardSkeleton({ className }: GameCardSkeletonProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-lg overflow-hidden", className)}>
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200">
        <Skeleton className="w-full h-full" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        {/* Tags Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Stats Skeleton */}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

interface GameListSkeletonProps {
  count?: number;
  className?: string;
}

export function GameListSkeleton({ count = 8, className }: GameListSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <GameCardSkeleton key={index} />
      ))}
    </div>
  );
}