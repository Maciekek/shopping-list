import { getList } from '@/app/lists/actions/list';
import List from '@/app/lists/[id]/List';


export default async function ListPage({ params }: { params: { id: string } }) {
  const listDetails: any = await getList(params.id);

  return (
    <List list={listDetails.items} listId={params.id}/>
  )
}
