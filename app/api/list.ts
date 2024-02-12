'use server'
import { auth } from '../auth';
import { getListByIdQuery, updateListQuery } from '../db/queries';
import { List } from '../models';

export async function getList(listId: number) {
  const session = await auth();
  console.log(3, 'hello', session, listId);

  const result = await getListByIdQuery(session?.user?.email!, listId);
  console.log(12, result);
  return result.rows[0]

}

export async function updateList(listId: number, list: List) {
  const session = await auth();
  console.log(3, 'hello', session, listId);

  const result = await updateListQuery(listId, list);
  console.log(21, result)
  // console.log(12, result);
  // return result.rows[0]

}
