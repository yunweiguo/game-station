import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('ourStory.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('ourStory.content1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('ourStory.content2')}
              </p>
              <p className="text-gray-600">
                {t('ourStory.content3')}
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="text-6xl mb-4">🎮</div>
                <p className="text-lg">Game Station Team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('mission.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('mission.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="text-indigo-600 text-2xl">🎯</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('mission.values.accessibility.title')}
                </h3>
                <p className="text-gray-600">
                  {t('mission.values.accessibility.description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="text-indigo-600 text-2xl">🎨</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('mission.values.quality.title')}
                </h3>
                <p className="text-gray-600">
                  {t('mission.values.quality.description')}
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <div className="text-indigo-600 text-2xl">🌍</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('mission.values.community.title')}
                </h3>
                <p className="text-gray-600">
                  {t('mission.values.community.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {t('team.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              {t('team.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <div className="text-gray-400 text-2xl">👨‍💻</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Alex Chen</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <div className="text-gray-400 text-2xl">👩‍💻</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
                <p className="text-gray-600">Lead Developer</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <div className="text-gray-400 text-2xl">🎨</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Mike Wilson</h3>
                <p className="text-gray-600">Game Designer</p>
              </div>
              
              <div className="text-center">
                <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <div className="text-gray-400 text-2xl">📱</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Emma Davis</h3>
                <p className="text-gray-600">Community Manager</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}