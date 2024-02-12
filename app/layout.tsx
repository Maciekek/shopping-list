import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import { Suspense } from 'react';

export const metadata = {
  title: 'Sharable shopping lists',
  description: ''
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        <div className={'container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
