import './globals.css';

import Nav from './nav';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/atoms/Toaster';
import Link from 'next/link';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

const SITE_URL = process.env.NEXTAUTH_URL || 'https://shopylist.pl';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');
  const locale = await getLocale();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('title'),
      template: '%s - Shopylist'
    },
    description: t('description'),
    applicationName: 'Shopylist',
    keywords: t('keywords').split(', '),
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: 'Shopylist',
      url: '/',
      title: t('title'),
      description: t('description'),
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      alternateLocale: locale === 'pl' ? ['en_US'] : ['pl_PL']
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description')
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

// @ts-ignore
export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tFooter = await getTranslations('Footer');

  return (
    <html lang={locale} className="h-full bg-gray-50">
      <body
        className={cn(
          'flex flex-col min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
        <Nav />
        <div
          className={
            'flex-grow container mx-auto max-w-7xl px-0 sm:px-6 lg:px-8 pb-8'
          }
        >
          {children}
        </div>
        <Toaster />
        </NextIntlClientProvider>

        <footer className="bg-gray-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline gap-2">
              <Link href={'/'} prefetch={true} className="text-lg font-bold tracking-tight text-gray-900">
                Shopylist
              </Link>
              <span className="text-xs text-gray-400" title="Version">
                v{process.env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </div>
            <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              <Link href="/terms" className="hover:text-gray-900">
                {tFooter('terms')}
              </Link>
              <Link href="/privacy" className="hover:text-gray-900">
                {tFooter('privacy')}
              </Link>
              <a
                href="https://github.com/Maciekek/shopping-list"
                className="hover:text-gray-900"
                target="_blank"
                rel="noreferrer"
              >
                {tFooter('source')}
              </a>
              <a href="mailto:maciekek@gmail.com" className="hover:text-gray-900">
                {tFooter('contact')}
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
