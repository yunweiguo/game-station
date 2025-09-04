import { notFound } from 'next/navigation';
import { GameCard } from '@/components/GameCard';
import { getGamesByCategory, getCategoryBySlug } from '@/lib/games';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const t = await getTranslations('categories');
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    notFound();
  }

  const games = await getGamesByCategory(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('allCategories')}
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {category.name}
              </h1>
              <p className="text-gray-600">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        {games.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No games found in this category
            </h3>
            <p className="text-gray-600">
              Check back later for new games in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}