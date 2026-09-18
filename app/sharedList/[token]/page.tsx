import List from '@/components/organisms/List';
import { List as ListModel, SharedList } from '@/models';
import { getPublicList } from '@/actions/lists';
import { auth } from '@/app/auth';
import { Badge } from '@/components/atoms/Badge';
import { getTranslations } from 'next-intl/server';
import { JoinPublicListButton } from '@/components/molecules/JoinPublicListButton';

export default async function SharedListPage({
  params
}: {
  params: { token: string };
}) {
  const list: SharedList = await getPublicList(params.token);
  const session = await auth();
  const t = await getTranslations('List');

  const isMember =
    !!session && !!list?.users.find((u) => u.userId === session.user.id);
  const isReadOnly = !isMember && list?.share?.type === 'READ';
  const canJoin = !isMember && list?.share?.type === 'WRITE';

  if (!list) {
    return (
      <div className={'w-full pt-20 flex justify-center items-center'}>
        {t('notShared')}
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between gap-3 lg:mt-14 min-h-14 py-2 px-4 bg-neutral-50 border border-slate-200 rounded-t-lg">
        <span className="text-lg font-semibold truncate">{list.name}</span>

        <div className="flex items-center gap-2 flex-none">
          {isReadOnly && <Badge variant="secondary">{t('readOnly')}</Badge>}
          {canJoin && (
            <JoinPublicListButton token={params.token} isSignedIn={!!session} />
          )}
          {isMember && (
            <Badge variant="secondary">{t('savedHint')}</Badge>
          )}
        </div>
      </header>

      <List
        list={list as ListModel}
        listId={list!.id}
        isReadOnly={isReadOnly}
      />
    </>
  );
}
