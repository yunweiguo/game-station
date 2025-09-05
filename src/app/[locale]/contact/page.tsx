import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export default async function ContactPage() {
  const t = await getTranslations('contact');

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {t('getInTouch.title')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <div className="text-indigo-600 text-xl">📧</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t('getInTouch.email.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('getInTouch.email.description')}
                    </p>
                    <a 
                      href="mailto:support@gamestation.com" 
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      support@gamestation.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <div className="text-indigo-600 text-xl">💬</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t('getInTouch.discord.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('getInTouch.discord.description')}
                    </p>
                    <a 
                      href="https://discord.gg/gamestation" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      discord.gg/gamestation
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 rounded-lg p-3 flex-shrink-0">
                    <div className="text-indigo-600 text-xl">🐦</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t('getInTouch.twitter.title')}
                    </h3>
                    <p className="text-gray-600">
                      {t('getInTouch.twitter.description')}
                    </p>
                    <a 
                      href="https://twitter.com/gamestation" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      @gamestation
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {t('faq.title')}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('faq.questions.q1.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('faq.questions.q1.answer')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('faq.questions.q2.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('faq.questions.q2.answer')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('faq.questions.q3.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('faq.questions.q3.answer')}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t('faq.questions.q4.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('faq.questions.q4.answer')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('responseTime.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                {t('responseTime.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg p-6">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {t('responseTime.emailTime.time')}
                  </div>
                  <div className="text-gray-600">
                    {t('responseTime.emailTime.channel')}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {t('responseTime.discordTime.time')}
                  </div>
                  <div className="text-gray-600">
                    {t('responseTime.discordTime.channel')}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {t('responseTime.socialTime.time')}
                  </div>
                  <div className="text-gray-600">
                    {t('responseTime.socialTime.channel')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}