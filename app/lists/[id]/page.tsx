'use server';
import { getList } from '@/app/lists/actions/list';
import List from '@/app/lists/[id]/List';
import { Button } from '@/components/atoms/Button';
import { List as ListModel, ListItem } from '@/models';

export default async function ListPage({ params }: { params: { id: string } }) {
  const listDetails: ListModel = await getList(params.id);

  return (
    <>
      <header className="flex items-center lg:mt-14 h-14 px-4 bg-neutral-50 border border-slate-200">
        <span className="text-lg font-semibold">{listDetails!.name}</span>

        <Button className="ml-auto w-8 h-8" size="icon" variant="ghost">
          <span className="sr-only">Settings</span>
        </Button>
      </header>

      <List list={listDetails!.items as ListItem[]} listId={params.id} />
    </>
  );
}
