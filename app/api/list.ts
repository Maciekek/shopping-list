'use server'
import { auth } from '../auth';
import { getListByIdQuery, getSharedListsQuery, updateListQuery } from '@/db/queries';
import { List, ListItem } from '@/models';

export async function getList(listId: number) {
  const session = await auth();
  console.log(3, 'hello', session, listId);

  const result = await getListByIdQuery(session?.user?.email!, listId);
  console.log(12, result);
  return result.rows[0]

}

export async function updateListItems(listId: number, list: ListItem[]) {
  const session = await auth();
  console.log(3, 'hello', session, listId);

  const result = await updateListQuery(listId, list);
  console.log(21, result)
}

export async function getSharedLists() {
  const session = await auth();

  const result = await getSharedListsQuery()
  console.log(21, result)

  return result


}
