'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';
import ListService from '@/services/ListService';
import { isError } from '@/lib/utils';
import { ListItem } from '@/models';

const getCurrentUserOrThrowError = async () => {
  const session = await auth();

  if (!session) {
    console.error('Not allowed operation. User is not logged in');
    redirect('');
  }

  return session!.user;
};

export async function getList(listId: string, withUsers = false) {
  const user = await getCurrentUserOrThrowError();
  const result = await ListService.getList({
    listId,
    userId: user.id,
    withUsers
  });

  if (isError(result)) {
    return result;
  }

  if (!result) {
    notFound();
  }

  return result;
}

export async function getUserLists() {
  const user = await getCurrentUserOrThrowError();

  return ListService.getAllUserLists({ userId: user.id });
}

export async function updateListItems(listId: string, newItems: ListItem[]) {
  const session = await auth();

  const result = await ListService.updateList({
    listId,
    user: session?.user,
    newItems
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath(`/lists/${listId}`);
}

export async function deleteItemFromList(listId: string, itemId: string) {
  const session = await auth();

  const result = await ListService.deleteItemFromList({
    listId,
    itemId,
    user: session?.user!
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath(`/lists/${listId}`);

}

export async function deleteList(listId: string) {
  const user = await getCurrentUserOrThrowError();

  const result = await ListService.deleteList({ listId, userId: user.id });

  if (result && isError(result)) {
    return result;
  }

  return redirect('/');
}

export async function createList(previousState: any, formData: FormData) {
  const user = await getCurrentUserOrThrowError();
  const schema = z.object({
    name: z.string().min(3).max(60)
  });

  const validatedFields = schema.safeParse({
    name: formData.get('name')
  });

  if (!validatedFields.success) {
    return {
      hasError: true,
      message: 'Form validation error',
      formErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const listName = formData.get('name') ? formData.get('name')! : '';

  const result = await ListService.createList({
    name: listName.toString(),
    userId: user.id
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath('/');
  redirect('/');
}

export async function shareList(previousState: any, formData: FormData) {
  const user = await getCurrentUserOrThrowError();

  const schema = z.object({
    email: z.string().min(3).max(60),
    listId: z.string()
  });

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    listId: formData.get('listId')
  });

  if (!validatedFields.success) {
    return {
      hasError: true,
      message: '',
      formErrors: validatedFields.error.flatten().fieldErrors
    };
  }

  const result = await ListService.grantAccessToList({
    listId: formData.get('listId')!.toString(),
    email: formData.get('email')!.toString(),
    user
  });

  if (result && isError(result)) {
    return result;
  }

  revalidatePath('/');
}

export async function revokeAccessToList(userId: string, listId: string) {
  const user = await getCurrentUserOrThrowError();

  const result = await ListService.revokeAccessToList({ listId, userId, user });

  if (result && isError(result)) {
    return result;
  }

  revalidatePath('/');
}

export async function makeListPublic(listId: string) {
  const user = await getCurrentUserOrThrowError();

  const result = await ListService.makeListPublic({
    listId,
    user
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath(`/`);
}

export async function changePublicListRole({
  listId,
  accessType
}: {
  listId: string;
  accessType: 'READ' | 'WRITE';
}) {
  const user = await getCurrentUserOrThrowError();
  const result = await ListService.changePublicListRole({
    listId,
    user,
    accessType
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath('/');
}

export async function makeListProtected(listId: string) {
  const user = await getCurrentUserOrThrowError();

  const result = await ListService.makeListProtected({
    listId,
    user
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath(`/`);
}

export async function getPublicList(token: string) {
  const shareList = await prisma.list.findFirst({
    where: {
      share: {
        token
      }
    },
    include: {
      share: true,
      users: true
    }
  });

  if (!shareList) {
    notFound();
  }

  return shareList;
}
