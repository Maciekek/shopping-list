'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Share2 } from 'lucide-react';
import { Session } from 'next-auth';
import { Button } from '@/components/atoms/Button';
import { ListWithUsersAndShare } from '@/models';
import { ShareListDialog } from '@/components/organisms/ShareListDialog';

export function ListHeader({
  list,
  user
}: {
  list: ListWithUsersAndShare;
  user: Session['user'];
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const t = useTranslations('ListTile');

  return (
    <header className="flex items-center justify-between lg:mt-14 h-14 px-4 bg-neutral-50 border border-slate-200 rounded-t-lg">
      <span className="text-lg font-semibold truncate">{list.name}</span>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600"
        onClick={() => setIsShareOpen(true)}
      >
        <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
        {t('share')}
      </Button>
      <ShareListDialog
        list={list}
        user={user}
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
      />
    </header>
  );
}
