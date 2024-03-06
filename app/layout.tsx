import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import { Suspense } from 'react';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Viewport } from 'next';
import { Toaster } from '@/components/atoms/Toaster';

export const metadata = {
  title: 'Sharable shopping lists',
  description: ''
};


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
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Suspense fallback={'loading...'}>
          <Nav />

        </Suspense>
        <div className={'container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          {children}
        </div>
        <Toaster />

        <Analytics />
      </body>
    </html>
  );
}
