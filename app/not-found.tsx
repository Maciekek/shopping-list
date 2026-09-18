import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('Errors');
  return <h1 className="p-8 text-center text-xl">404 - {t('notFound')}</h1>;
}
