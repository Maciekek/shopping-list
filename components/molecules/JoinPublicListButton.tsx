'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { joinPublicList } from '@/actions/lists';
import { useToast } from '@/hooks/use-toast';

export function JoinPublicListButton({
  token,
  isSignedIn
}: {
  token: string;
  isSignedIn: boolean;
}) {
  const t = useTranslations('List');
  const tErrors = useTranslations('Errors');
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!isSignedIn) {
      signIn('google', { callbackUrl: `/sharedList/${token}` });
      return;
    }

    startTransition(async () => {
      const result = await joinPublicList(token);
      if (result?.hasError) {
        toast({ title: tErrors(result.message as any) });
      }
    });
  };

  return (
    <Button variant="outline" size="sm" disabled={isPending} onClick={onClick}>
      <BookmarkPlus className="h-4 w-4 mr-2" aria-hidden="true" />
      {isSignedIn ? t('saveToMyLists') : t('signInToSave')}
    </Button>
  );
}
