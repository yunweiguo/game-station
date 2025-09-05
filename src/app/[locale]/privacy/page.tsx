import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export default async function PrivacyPage() {
  const t = await getTranslations('privacy');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-grow">
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('subtitle')}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                {t('lastUpdated')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('introduction.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('introduction.content1')}
              </p>
              <p className="text-gray-600">
                {t('introduction.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('informationWeCollect.title')}
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('informationWeCollect.personalInformation.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('informationWeCollect.personalInformation.content')}
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>{t('informationWeCollect.personalInformation.items.name')}</li>
                <li>{t('informationWeCollect.personalInformation.items.email')}</li>
                <li>{t('informationWeCollect.personalInformation.items.password')}</li>
                <li>{t('informationWeCollect.personalInformation.items.profile')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('informationWeCollect.usageData.title')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('informationWeCollect.usageData.content')}
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-6">
                <li>{t('informationWeCollect.usageData.items.pages')}</li>
                <li>{t('informationWeCollect.usageData.items.time')}</li>
                <li>{t('informationWeCollect.usageData.items.games')}</li>
                <li>{t('informationWeCollect.usageData.items.device')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('informationWeCollect.cookies.title')}
              </h3>
              <p className="text-gray-600">
                {t('informationWeCollect.cookies.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howWeUseInformation.title')}
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>{t('howWeUseInformation.items.provide')}</li>
                <li>{t('howWeUseInformation.items.improve')}</li>
                <li>{t('howWeUseInformation.items.communicate')}</li>
                <li>{t('howWeUseInformation.items.analyze')}</li>
                <li>{t('howWeUseInformation.items.security')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('dataProtection.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('dataProtection.content1')}
              </p>
              <p className="text-gray-600">
                {t('dataProtection.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('dataSharing.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('dataSharing.content1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('dataSharing.content2')}
              </p>
              <ul className="list-disc list-inside text-gray-600">
                <li>{t('dataSharing.exceptions.legal')}</li>
                <li>{t('dataSharing.exceptions.protect')}</li>
                <li>{t('dataSharing.exceptions.rights')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('yourRights.title')}
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>{t('yourRights.items.access')}</li>
                <li>{t('yourRights.items.correct')}</li>
                <li>{t('yourRights.items.delete')}</li>
                <li>{t('yourRights.items.object')}</li>
                <li>{t('yourRights.items.portable')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('childrenPrivacy.title')}
              </h2>
              <p className="text-gray-600">
                {t('childrenPrivacy.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('changesToPolicy.title')}
              </h2>
              <p className="text-gray-600">
                {t('changesToPolicy.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('contactUs.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('contactUs.content')}
              </p>
              <p className="text-gray-600">
                <strong>{t('contactUs.emailLabel')}:</strong>{' '}
                <a href="mailto:privacy@gamestation.com" className="text-indigo-600 hover:text-indigo-700">
                  privacy@gamestation.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}