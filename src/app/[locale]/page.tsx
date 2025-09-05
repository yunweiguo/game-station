import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { GameCard } from '@/components/GameCard';
import { getFeaturedGames, getPopularGames } from '@/lib/games';
import { getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/ui/animations';

export default async function HomePage() {
  const t = await getTranslations('home');
  const [featuredGames, popularGames] = await Promise.all([
    getFeaturedGames(),
    getPopularGames()
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="text-center mb-12">
          <FadeIn duration={800}>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('subtitle')}
            </p>
          </FadeIn>
        </section>

        <section className="mb-12">
          <FadeIn duration={600} delay={200}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('featured')}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredGames.map((game, index) => (
              <FadeIn key={game.id} duration={500} delay={300 + index * 100}>
                <GameCard game={game} />
              </FadeIn>
            ))}
          </div>
        </section>

        <section>
          <FadeIn duration={600} delay={400}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('popular')}
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGames.map((game, index) => (
              <FadeIn key={game.id} duration={500} delay={500 + index * 100}>
                <GameCard game={game} />
              </FadeIn>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}