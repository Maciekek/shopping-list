import { Button } from '@/components/atoms/Button';
import { List as ListModel } from '@/models';
import { getList } from '@/actions/lists';
import List from '@/components/organisms/List';
import { auth } from '@/app/auth';

export default async function ListPage({ params }: { params: { id: string } }) {
  const listDetails: ListModel = await getList(params.id, true);

  return (
    <>
      <header className="flex items-center lg:mt-14 h-14 px-4 bg-neutral-50 border border-slate-200 rounded-t-lg">
        <span className="text-lg font-semibold">{listDetails!.name}</span>

        {/*<Button className="ml-auto w-8 h-8" size="icon" variant="ghost">*/}
        {/*  <span className="sr-only">Settings</span>*/}
        {/*</Button>*/}
      </header>

      <List list={listDetails} listId={params.id}  isReadOnly={false} />
    </>
  );
}
