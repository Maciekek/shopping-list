import List from '@/components/organisms/List';
import { List as ListModel, SharedList } from '@/models';
import { getPublicList } from '@/actions/lists';
import { auth } from '@/app/auth';
import { Badge } from '@/components/atoms/Badge';
import { getTranslations } from 'next-intl/server';

export default async function SharedListPage({
  params
}: {
  params: { token: string };
}) {
  const list: SharedList = await getPublicList(params.token);
  const session = await auth();
  const t = await getTranslations('List');

  const isUserOwner =
    session && !!list?.users.find((u) => u.userId === session?.user.id);
  const isReadOnly = !isUserOwner && list?.share?.type === 'READ';

  if (!list) {
    return (
      <div className={'w-full pt-20 flex justify-center items-center'}>
        {t('notShared')}
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between  lg:mt-14 h-14 px-4 bg-neutral-50 border border-slate-200 rounded-t-lg">
        <span className="text-lg font-semibold">{list!.name}</span>

        {isReadOnly && <Badge variant="secondary">{t('readOnly')}</Badge>}
      </header>

      <List
        list={list as ListModel}
        listId={list!.id}
        isReadOnly={isReadOnly}
      />
    </>
  );
}
