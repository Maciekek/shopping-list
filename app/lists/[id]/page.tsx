import { ListOrError, ListWithUsersAndShare } from '@/models';
import { getList } from '@/actions/lists';
import List from '@/components/organisms/List';
import { ListHeader } from '@/components/organisms/ListHeader';
import { isError } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import { auth } from '@/app/auth';

export default async function ListPage({ params }: { params: { id: string } }) {
  const [listDetails, session] = await Promise.all([
    getList(params.id, true) as Promise<ListOrError>,
    auth()
  ]);

  if (isError(listDetails)) {
    const t = await getTranslations('Errors');
    return <div className="p-8 text-center">{t(listDetails.message as any)}</div>;
  }

  return (
    <>
      <ListHeader
        list={listDetails as ListWithUsersAndShare}
        user={session!.user}
      />
      <List list={listDetails} listId={params.id} isReadOnly={false} />
    </>
  );
}
