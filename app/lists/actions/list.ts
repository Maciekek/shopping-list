'use server';

import {
  createListQuery,
  deleteListQuery,
  getListByIdQuery,
  getSharedListsQuery,
  shareListQuery,
  updateListQuery
} from '@/db/queries';
import { z } from 'zod';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ListItem } from '@/models';

export async function getList(listId: number) {
  const result = await getListByIdQuery(listId);
  return result?.rows[0];
}

export async function updateListItems(listId: number, list: ListItem[]) {

  const result = await updateListQuery(listId, list);
}

export async function getSharedLists() {
  const session = await auth();

  const result = await getSharedListsQuery();

  return result;
}

export async function deleteList(id: number) {
  const result = await deleteListQuery(id);

  return redirect('/');
}

export async function createListAction(previousState: any, formData: any) {
  const session = await auth();
  const schema = z.object({
    name: z.string().min(3).max(60)
  });

  const validatedFields = schema.safeParse({
    name: formData.get('name')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const list = {
    name: formData.get('name') ? formData.get('name')! : '',
    items: []
  };

  await createListQuery(list);
  revalidatePath('/');
  redirect('/');
}

export async function shareList(previousState: any, formData: any) {
  const session = await auth();
  const schema = z.object({
    email: z.string().min(3).max(60),
    listId: z.string()
  });

  console.log(39, formData.get('email'), formData.get('listId'));

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    listId: formData.get('listId')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  try {
    const result = await shareListQuery(
      formData.get('email'),
      formData.get('listId')
    );
  } catch (e) {
    console.log(60, e);
    return 'ok';
  }

  return 'ok';
}
