import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Meta');
  return {
    title: t('listsTitle'),
    robots: { index: false, follow: false }
  };
}

export default function ListsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
