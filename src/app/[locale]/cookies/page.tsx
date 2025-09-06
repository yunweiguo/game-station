import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { getTranslations } from 'next-intl/server';

export default async function CookiesPage() {
  const t = await getTranslations('cookies');

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
                {t('whatAreCookies.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('whatAreCookies.content1')}
              </p>
              <p className="text-gray-600">
                {t('whatAreCookies.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('howWeUseCookies.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('howWeUseCookies.content')}
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {t('cookieTypes.title')}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('cookieTypes.necessary.title')}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {t('cookieTypes.necessary.description')}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>{t('cookieTypes.purpose')}:</strong> {t('cookieTypes.necessary.purpose')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('cookieTypes.analytics.title')}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {t('cookieTypes.analytics.description')}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>{t('cookieTypes.purpose')}:</strong> {t('cookieTypes.analytics.purpose')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('cookieTypes.preferences.title')}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {t('cookieTypes.preferences.description')}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>{t('cookieTypes.purpose')}:</strong> {t('cookieTypes.preferences.purpose')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {t('cookieTypes.marketing.title')}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {t('cookieTypes.marketing.description')}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>{t('cookieTypes.purpose')}:</strong> {t('cookieTypes.marketing.purpose')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('specificCookies.title')}
              </h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('cookieTable.name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('cookieTable.purpose')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('cookieTable.duration')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('cookieTable.type')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        _ga
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies._ga.purpose')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies._ga.duration')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.typeAnalytics')}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        _gid
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies._gid.purpose')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies._gid.duration')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.typeAnalytics')}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        next-auth.session-token
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies.session.purpose')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies.session.duration')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.typeNecessary')}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        next-auth.csrf-token
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies.csrf.purpose')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.cookies.csrf.duration')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {t('cookieTable.typeNecessary')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('managingCookies.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('managingCookies.content1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('managingCookies.content2')}
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  {t('managingCookies.browsers.title')}
                </h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                  <li>{t('managingCookies.browsers.chrome')}</li>
                  <li>{t('managingCookies.browsers.firefox')}</li>
                  <li>{t('managingCookies.browsers.safari')}</li>
                  <li>{t('managingCookies.browsers.edge')}</li>
                </ul>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('thirdPartyCookies.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('thirdPartyCookies.content1')}
              </p>
              <p className="text-gray-600">
                {t('thirdPartyCookies.content2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('cookieConsent.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('cookieConsent.content1')}
              </p>
              <p className="text-gray-600 mb-4">
                {t('cookieConsent.content2')}
              </p>
              <p className="text-gray-600">
                {t('cookieConsent.content3')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('updates.title')}
              </h2>
              <p className="text-gray-600">
                {t('updates.content')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('contact.title')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('contact.content')}
              </p>
              <p className="text-gray-600">
                <strong>{t('contact.emailLabel')}:</strong>{' '}
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