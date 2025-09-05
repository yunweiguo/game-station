import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export default async function TermsPage() {
  const t = await getTranslations('terms');

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
                {t('acceptance.title')}
              </h2>
              <p className="text-gray-600">
                {t('acceptance.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('services.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('services.content1')}
              </p>
              <p className="text-gray-600">
                {t('services.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('userAccounts.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('userAccounts.content1')}
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>{t('userAccounts.responsibilities.accurate')}</li>
                <li>{t('userAccounts.responsibilities.security')}</li>
                <li>{t('userAccounts.responsibilities.liability')}</li>
              </ul>
              <p className="text-gray-600">
                {t('userAccounts.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('acceptableUse.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('acceptableUse.content')}
              </p>
              <p className="text-gray-600 font-semibold mb-3">
                {t('acceptableUse.prohibited.title')}:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>{t('acceptableUse.prohibited.illegal')}</li>
                <li>{t('acceptableUse.prohibited.harmful')}</li>
                <li>{t('acceptableUse.prohibited.infringing')}</li>
                <li>{t('acceptableUse.prohibited.harassment')}</li>
                <li>{t('acceptableUse.prohibited.spam')}</li>
                <li>{t('acceptableUse.prohibited.malware')}</li>
                <li>{t('acceptableUse.prohibited.impersonation')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('intellectualProperty.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('intellectualProperty.content1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('intellectualProperty.content2')}
              </p>
              <p className="text-gray-600">
                {t('intellectualProperty.content3')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('userContent.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('userContent.content1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('userContent.license.title')}
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4">
                <li>{t('userContent.license.rights.reproduce')}</li>
                <li>{t('userContent.license.rights.modify')}</li>
                <li>{t('userContent.license.rights.distribute')}</li>
                <li>{t('userContent.license.rights.display')}</li>
              </ul>
              <p className="text-gray-600">
                {t('userContent.responsibility')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('disclaimer.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('disclaimer.content1')}
              </p>
              <p className="text-gray-600">
                {t('disclaimer.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('limitationOfLiability.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('limitationOfLiability.content1')}
              </p>
              <p className="text-gray-600">
                {t('limitationOfLiability.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('indemnification.title')}
              </h2>
              <p className="text-gray-600">
                {t('indemnification.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('termination.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('termination.content1')}
              </p>
              <p className="text-gray-600">
                {t('termination.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('governingLaw.title')}
              </h2>
              <p className="text-gray-600">
                {t('governingLaw.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('changesToTerms.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('changesToTerms.content1')}
              </p>
              <p className="text-gray-600">
                {t('changesToTerms.content2')}
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
                <a href="mailto:legal@gamestation.com" className="text-indigo-600 hover:text-indigo-700">
                  legal@gamestation.com
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