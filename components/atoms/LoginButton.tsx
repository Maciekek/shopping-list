'use client';
import { Button } from '@/components/atoms/Button';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export const LoginButton = () => {
  const t = useTranslations('Landing');

  return (
    <Button className="w-full" onClick={() => signIn('google')}>
      {t('signInWithGoogle')}
    </Button>
  );
};
