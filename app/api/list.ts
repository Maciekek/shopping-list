'use server'
import { auth } from '../auth';
import { deleteListQuery, getListByIdQuery, getSharedListsQuery, updateListQuery } from '@/db/queries';
import { List, ListItem } from '@/models';

export async function getList(listId: number) {
  const result = await getListByIdQuery( listId);
  return result?.rows[0]
}

export async function updateListItems(listId: number, list: ListItem[]) {
  const session = await auth();
  const result = await updateListQuery(listId, list);
}

export async function getSharedLists() {
  const session = await auth();

  const result = await getSharedListsQuery()
  console.log(21, result)

  return result
}

export async function deleteList(id: number) {
  const result = await deleteListQuery(id)
  return result;

}
