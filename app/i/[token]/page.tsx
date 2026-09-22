import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/app/auth';
import { getInvite } from '@/actions/lists';
import { db } from '@/db';
import { isError } from '@/lib/utils';
import { JoinInviteButton } from '@/components/molecules/JoinInviteButton';

export const dynamic = 'force-dynamic';

export default async function InvitePage({ params }: { params: { token: string } }) {
  const [invite, session, t] = await Promise.all([
    getInvite(params.token),
    auth(),
    getTranslations('Invite')
  ]);

  if (!invite) {
    return (
      <main className="px-4 pt-20 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{t('invalidTitle')}</h1>
        <p className="mt-2 text-gray-600">{t('invalidText')}</p>
      </main>
    );
  }

  // Already a member: nothing to claim, go straight to the list.
  if (session) {
    const list = await db.lists.getUserList({ listId: invite.listId, userId: session.user.id });
    if (list && !isError(list)) redirect(`/lists/${invite.listId}`);
  }

  return (
    <main className="px-4 pt-20">
      <div className="mx-auto max-w-md rounded-xl border bg-white p-8 text-center space-y-4">
        <p className="text-sm text-gray-500">
          {invite.inviterName ? t('invitedBy', { name: invite.inviterName }) : t('invited')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{invite.listName}</h1>
        <p className="text-gray-600">{t('members', { count: invite.memberCount })}</p>
        <p className="text-sm text-gray-500">
          {session ? t('joinHint') : t('signInHint')}
        </p>
        <JoinInviteButton token={params.token} isSignedIn={!!session} />
      </div>
    </main>
  );
}
