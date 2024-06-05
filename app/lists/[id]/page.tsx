import { List as ListModel, ListOrError } from '@/models';
import { getList } from '@/actions/lists';
import List from '@/components/organisms/List';
import { isError } from '@/lib/utils';

export default async function ListPage({ params }: { params: { id: string } }) {
  const listDetails: ListOrError = await getList(params.id, true);

  if (isError(listDetails)) {
    return <div>{listDetails?.message}</div>;
  }

  return (
    <>
      <header className="flex items-center lg:mt-14 h-14 px-4 bg-neutral-50 border border-slate-200 rounded-t-lg">
        <span className="text-lg font-semibold">{listDetails!.name}</span>
      </header>

      <List list={listDetails} listId={params.id} isReadOnly={false} />
    </>
  );
}
