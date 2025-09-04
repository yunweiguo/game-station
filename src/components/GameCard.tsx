import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, Star, Play } from 'lucide-react';

interface GameCardProps {
  game: {
    id: string;
    slug: string;
    name: string;
    description: string;
    thumbnail: string;
    playCount: number;
    rating: number;
  };
}

export function GameCard({ game }: GameCardProps) {
  const t = useTranslations('games');
  
  return (
    <Link href={`/games/${game.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={game.thumbnail}
            alt={game.name}
            width={300}
            height={200}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
              <Play className="w-4 h-4" />
              {t('playNow')}
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{game.rating}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">
            {game.name}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Gamepad2 className="w-3 h-3" />
              {t('playCount', { count: game.playCount })}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{t('rating', { rating: game.rating })}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}