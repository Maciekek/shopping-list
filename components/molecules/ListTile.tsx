'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Session } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/atoms/Dropdown-menu';
import { MoreHorizontalIcon } from '@/components/atoms/Icons';
import { ListWithUsersAndShare } from '@/models';
import { deleteList, revokeAccessToList } from '@/actions/lists';
import { useErrorSupport } from '@/hooks/use-error-support';
import { ShareListDialog } from '@/components/organisms/ShareListDialog';

export default function ListTile({
  list,
  user
}: {
  list: ListWithUsersAndShare;
  user: Session['user'];
}) {
  const ownerEmail =
    list.users.filter((user) => user.userId === list.ownerId)[0]?.user.email ||
    '';

  const status = user.id === list.ownerId ? 'owner' : 'shared';

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { withToastOnError } = useErrorSupport();
  const t = useTranslations('ListTile');

  const revokeAccess = (userId: string) => {
    return revokeAccessToList(userId, list.id);
  };

  return (
    <div>
      <div className="p-2 pr-4 bg-white rounded-lg border">
        <div className="flex justify-between items-center min-h-[60px] ">
          <Link
            prefetch={true}
            href={`/lists/${list.id}`}
            className={'flex-1 pl-4 pt-4'}
          >
            <h5 className="text-xl font-bold leading-none text-gray-900">
              {list.name}
            </h5>
            <div
              className={
                'leading-6 pb-1 text-sm text-gray-500 dark:text-gray-400'
              }
            >
              {status === 'shared'
                ? t('owner', { email: ownerEmail })
                : t('youAreOwner')}
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <a className="text-gray-400 hover:text-gray-500" href="#">
                <MoreHorizontalIcon className="w-5 h-5" />
              </a>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status === 'owner' && (
                <DropdownMenuItem
                  onClick={withToastOnError(() => deleteList(list.id))}
                >
                  {t('delete')}
                </DropdownMenuItem>
              )}

              {status === 'shared' && (
                <DropdownMenuItem
                  onClick={withToastOnError(() => revokeAccess(user.id))}
                >
                  {t('rejectShare')}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setIsShareModalOpen(true);
                }}
              >
                {t('share')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ShareListDialog
        list={list}
        user={user}
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
      />
    </div>
  );
}
