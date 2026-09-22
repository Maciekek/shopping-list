'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/atoms/Button';
import { claimInvite } from '@/actions/lists';
import { useToast } from '@/hooks/use-toast';

export function JoinInviteButton({
  token,
  isSignedIn
}: {
  token: string;
  isSignedIn: boolean;
}) {
  const t = useTranslations('Invite');
  const tErrors = useTranslations('Errors');
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    if (!isSignedIn) {
      signIn('google', { callbackUrl: `/i/${token}` });
      return;
    }

    startTransition(async () => {
      const result = await claimInvite(token);
      if (result?.hasError) {
        toast({ title: tErrors(result.message as any) });
      }
    });
  };

  return (
    <Button className="w-full" disabled={isPending} onClick={onClick}>
      {isSignedIn ? t('join') : t('signInAndJoin')}
    </Button>
  );
}
