import { getTranslations } from 'next-intl/server';
import { WifiOff } from 'lucide-react';

export default async function OfflinePage() {
  const t = await getTranslations('Offline');

  return (
    <main className="px-4 pt-24 text-center">
      <WifiOff className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{t('title')}</h1>
      <p className="mt-2 text-gray-600">{t('text')}</p>
    </main>
  );
}
