import Link from 'next/link';
import { ReactNode } from 'react';

export const CONTACT_EMAIL = 'maciekek@gmail.com';
export const LEGAL_UPDATED = '2026-09-18';

/** Shared frame for /terms and /privacy: typography for plain h1/h2/p/ul/li children. */
export function LegalPage({
  title,
  updatedLabel,
  backLabel,
  children
}: {
  title: string;
  updatedLabel: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <article
      className={
        'mx-auto max-w-3xl px-4 py-10 text-gray-800 ' +
        '[&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold ' +
        '[&_p]:my-3 [&_p]:leading-7 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_li]:leading-7 ' +
        '[&_a]:underline [&_a]:underline-offset-2 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1'
      }
    >
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
        ← {backLabel}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-gray-500">
        {updatedLabel}: {LEGAL_UPDATED}
      </p>
      {children}
    </article>
  );
}
