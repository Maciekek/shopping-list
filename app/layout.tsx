import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import Nav from './nav';
import { Suspense } from 'react';
import { Inter as FontSans } from "next/font/google"
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Sharable shopping lists',
  description: ''
};

// @ts-ignore
export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body  className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
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
