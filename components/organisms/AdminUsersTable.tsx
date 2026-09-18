'use client';

import Image from 'next/image';
import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { deleteUserAsAdmin } from '@/actions/admin';
import { Button } from '@/components/atoms/Button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/atoms/Table';

export type AdminUserRow = {
  id: string;
  name: string;
  email: string | null;
  image: string | null;
  createdAt: string;
  ownedLists: number;
  memberOfLists: number;
};

export function AdminUsersTable({
  users,
  currentUserId,
  locale
}: {
  users: AdminUserRow[];
  currentUserId: string;
  locale: string;
}) {
  const t = useTranslations('Admin');
  const tErrors = useTranslations('Errors');
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });

  const remove = (user: AdminUserRow) => {
    if (!window.confirm(t('confirmDelete', { email: user.email ?? user.name }))) return;

    startTransition(async () => {
      const result = await deleteUserAsAdmin(user.id);
      toast({
        title: result.hasError ? tErrors(result.message as any) : t('deleted')
      });
    });
  };

  return (
    <div className="rounded-xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('user')}</TableHead>
            <TableHead>{t('joined')}</TableHead>
            <TableHead className="text-right">{t('ownedLists')}</TableHead>
            <TableHead className="text-right">{t('memberOf')}</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-medium">{user.name}</div>
                    <div className="truncate text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap text-gray-600">
                {dateFormat.format(new Date(user.createdAt))}
              </TableCell>
              <TableCell className="text-right">{user.ownedLists}</TableCell>
              <TableCell className="text-right">{user.memberOfLists}</TableCell>
              <TableCell className="text-right">
                {user.id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    disabled={isPending}
                    onClick={() => remove(user)}
                  >
                    {t('delete')}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
