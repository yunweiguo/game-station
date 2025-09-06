import Providers from "@/components/providers";
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const locales = ['en', 'zh'];

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as (typeof locales)[number])) notFound();

  // Providing all messages to the client
  const messages = await getMessages();

  return (
    <Providers messages={messages} locale={locale}>
      {children}
    </Providers>
  );
}
