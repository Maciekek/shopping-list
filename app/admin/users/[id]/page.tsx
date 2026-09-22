import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAdminUserDetails } from '@/actions/admin';
import { getAdminUser } from '@/lib/admin';
import { Badge } from '@/components/atoms/Badge';

export const dynamic = 'force-dynamic';

export default async function AdminUserPage({ params }: { params: { id: string } }) {
  const admin = await getAdminUser();
  // Non-admins get a 404, not a 403: the page should not reveal it exists.
  if (!admin) notFound();

  const [details, t, locale] = await Promise.all([
    getAdminUserDetails(params.id),
    getTranslations('Admin'),
    getLocale()
  ]);
  if (!details) notFound();

  const { user, logins, lists } = details;
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  const dateTimeFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <main className="px-4 pt-6 space-y-6">
      <Link href="/admin" className="text-sm text-gray-500 hover:underline">
        ← {t('backToAdmin')}
      </Link>

      <div className="flex items-center gap-4">
        {user.image ? (
          <Image src={user.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full" />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gray-200" />
        )}
        <div className="min-w-0">
          <h1 className="truncate text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="truncate text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500">
            {t('joined')}: {dateFormat.format(new Date(user.createdAt))} ·{' '}
            {t('lastActive').toLowerCase()}:{' '}
            {user.lastActiveAt ? dateTimeFormat.format(new Date(user.lastActiveAt)) : t('never')} ·{' '}
            {t('lastLogin').toLowerCase()}:{' '}
            {user.lastLoginAt ? dateTimeFormat.format(new Date(user.lastLoginAt)) : t('never')} ·{' '}
            {t('loginCount', { count: user.loginCount })}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t('userLists')} <span className="text-gray-400">({lists.length})</span>
          </h2>
          {lists.length === 0 && <p className="text-sm text-gray-500">{t('noLists')}</p>}
          {lists.map((list) => {
            const bought = list.items.filter((i) => i.selected).length;
            return (
              <details key={list.id} className="rounded-xl border bg-white">
                <summary className="flex cursor-pointer flex-wrap items-center gap-2 p-4">
                  <span className="font-medium">{list.name}</span>
                  <Badge variant={list.isOwner ? 'default' : 'secondary'}>
                    {list.isOwner ? t('owner') : t('memberOfList')}
                  </Badge>
                  {list.shareType && (
                    <Badge variant="outline">
                      {list.shareType === 'WRITE' ? t('publicWrite') : t('publicRead')}
                    </Badge>
                  )}
                  <span className="ml-auto text-sm text-gray-500">
                    {t('itemsCount', { count: list.items.length })}
                    {bought > 0 && ` · ${bought} ${t('bought')}`} ·{' '}
                    {t('members', { count: list.memberCount })}
                  </span>
                </summary>
                <div className="border-t px-4 py-3 text-sm">
                  {!list.isOwner && list.ownerEmail && (
                    <p className="mb-2 text-gray-500">{t('ownerLabel', { email: list.ownerEmail })}</p>
                  )}
                  {list.items.length === 0 ? (
                    <p className="text-gray-400">{t('noItems')}</p>
                  ) : (
                    <ul className="columns-1 gap-6 sm:columns-2">
                      {list.items.map((item) => (
                        <li
                          key={item.uuid}
                          className={item.selected ? 'text-gray-400 line-through' : ''}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
            );
          })}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">
            {t('loginHistory')} <span className="text-gray-400">({user.loginCount})</span>
          </h2>
          <div className="rounded-xl border bg-white">
            {logins.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">{t('noLogins')}</p>
            ) : (
              <ul className="divide-y text-sm">
                {logins.map((login) => (
                  <li key={login.id} className="flex justify-between gap-2 px-4 py-2">
                    <span>{dateTimeFormat.format(new Date(login.createdAt))}</span>
                    <span className="text-gray-400">{login.provider}</span>
                  </li>
                ))}
              </ul>
            )}
            {user.loginCount > logins.length && (
              <p className="border-t px-4 py-2 text-xs text-gray-400">
                {t('loginHistoryNote', { limit: details.loginHistoryLimit, total: user.loginCount })}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
