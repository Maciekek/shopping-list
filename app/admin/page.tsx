import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAdminOverview } from '@/actions/admin';
import { getAdminUser } from '@/lib/admin';
import { AdminUsersTable } from '@/components/organisms/AdminUsersTable';

export const dynamic = 'force-dynamic';

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-1 text-3xl font-bold tracking-tight">{value}</div>
    </div>
  );
}

export default async function AdminPage() {
  const admin = await getAdminUser();
  // Non-admins get a 404, not a 403: the page should not reveal it exists.
  if (!admin) notFound();

  const [overview, t, locale] = await Promise.all([
    getAdminOverview(),
    getTranslations('Admin'),
    getLocale()
  ]);
  if (!overview) notFound();

  return (
    <main className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-gray-500">{t('signedInAs', { email: admin.email ?? '' })}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t('users')} value={overview.stats.userCount} />
        <Stat label={t('lists')} value={overview.stats.listCount} />
        <Stat label={t('items')} value={overview.stats.itemCount} />
        <Stat label={t('publicLists')} value={overview.stats.sharedListCount} />
      </div>

      <AdminUsersTable users={overview.users} currentUserId={admin.id} locale={locale} />
    </main>
  );
}
