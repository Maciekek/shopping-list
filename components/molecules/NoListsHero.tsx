import { ShoppingBagIcon } from '@/components/atoms/Icons';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const NoListsHero = () => {
  const t = useTranslations('Lists');

  return (
    <div className="flex items-center justify-center w-full h-[300px]">
      <div className="flex flex-col items-center gap-2 text-center">
        <ShoppingBagIcon className="h-10 w-10" />
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tighter">
            {t('noListsTitle')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('noListsLead')}
          </p>
        </div>

        <Link href={'/lists/create'} prefetch={true}>
          {' '}
          <Button className="mt-4">{t('createFirst')}</Button>
        </Link>
      </div>
    </div>
  );
};
