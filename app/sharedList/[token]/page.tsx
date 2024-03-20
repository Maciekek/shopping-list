import List from '@/components/organisms/List';
import { Button } from '@/components/atoms/Button';
import { List as ListModel, SharedList } from '@/models';
import { getPublicList } from '@/actions/lists';
import { auth } from '@/app/auth';
import { Badge } from '@/components/atoms/Badge';

export default async function SharedListPage({
  params
}: {
  params: { token: string };
}) {
  const list: SharedList = await getPublicList(params.token);
  const session = await auth();

  const isUserOwner =
    session && !!list?.users.find((u) => u.userId === session?.user.id);
  const isReadOnly = !isUserOwner && list?.share?.type === 'READ';

  if (!list) {
    return (
      <div className={'w-full pt-20 flex justify-center items-center'}>
        List is not exist or no longer shared
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between  lg:mt-14 h-14 px-4 bg-neutral-50 border border-slate-200 rounded-t-lg">
        <span className="text-lg font-semibold">{list!.name}</span>

        {isReadOnly && <Badge variant="secondary">Read only mode</Badge>}
      </header>

      <List
        list={list as ListModel}
        listId={list!.id}
        isReadOnly={isReadOnly}
      />
    </>
  );
}
