'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { setLocale } from '@/actions/locale';
import { locales } from '@/i18n/config';
import { cn } from '@/lib/utils';

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations('Nav');
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t('language')}
      className={cn('inline-flex rounded-md border text-xs font-medium', className)}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          disabled={isPending || code === locale}
          onClick={() => startTransition(() => setLocale(code))}
          className={cn(
            'px-2 py-1 uppercase first:rounded-l-md last:rounded-r-md',
            code === locale
              ? 'bg-slate-800 text-white'
              : 'text-gray-500 hover:bg-gray-100'
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
