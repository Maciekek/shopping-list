'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/app/auth';
import ListService from '@/services/ListService';
import { isError } from '@/lib/utils';
import { ListItem } from '@/models';
import { sortItemsByCategory } from '@/lib/categorize';

const getCurrentUserOrThrowError = async () => {
  const session = await auth();

  if (!session) {
    console.error('Not allowed operation. User is not logged in');
    redirect('/api/auth/signin?callbackUrl=/');
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

export async function updateListItems(
  listId: string,
  newItems: ListItem[],
  clientId?: string
) {
  const session = await auth();

  const result = await ListService.updateList({
    listId,
    user: session?.user,
    newItems,
    clientId
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath(`/lists/${listId}`);
}

export async function sortListByCategory(listId: string, clientId?: string) {
  const user = await getCurrentUserOrThrowError();

  const list = await ListService.getList({ listId, userId: user.id });

  if (isError(list)) {
    return list;
  }

  if (!list) {
    notFound();
  }

  const items = (list.items as ListItem[]) ?? [];

  if (items.length < 2) {
    return;
  }

  let sortedItems: ListItem[];
  try {
    sortedItems = await sortItemsByCategory(items);
  } catch (error) {
    console.error('Failed to sort list by category', error);
    return {
      hasError: true,
      message: 'sortFailed'
    };
  }

  const result = await ListService.updateList({
    listId,
    user,
    newItems: sortedItems,
    clientId
  });

  if (isError(result)) {
    return result;
  }

  revalidatePath(`/lists/${listId}`);
}

export async function deleteItemFromList(
  listId: string,
  itemId: string,
  clientId?: string
) {
  const session = await auth();

  const result = await ListService.deleteItemFromList({
    listId,
    itemId,
    user: session?.user!,
    clientId
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
    return { hasError: true, error: 'listNameLength' };
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
    email: z.string().email(),
    listId: z.string()
  });

  const validatedFields = schema.safeParse({
    email: formData.get('email'),
    listId: formData.get('listId')
  });

  if (!validatedFields.success) {
    return { success: false, error: 'invalidEmail' };
  }

  const { listId, email } = validatedFields.data;

  if (email.toLowerCase() === user.email?.toLowerCase()) {
    return { success: false, error: 'shareWithSelf' };
  }

  const result = await ListService.grantAccessToList({
    listId,
    email: email.toLowerCase(),
    user
  });

  if (isError(result)) {
    return { success: false, error: result.message };
  }

  revalidatePath('/');
  revalidatePath(`/lists/${listId}`);
  return { success: true, invited: result.invited };
}

export async function revokeInvite(inviteId: string, listId: string) {
  const user = await getCurrentUserOrThrowError();

  const result = await ListService.revokeInvite({ listId, inviteId, user });

  if (result && isError(result)) {
    return result;
  }

  revalidatePath('/');
  revalidatePath(`/lists/${listId}`);
}

export async function revokeAccessToList(userId: string, listId: string) {
  const user = await getCurrentUserOrThrowError();

  const result = await ListService.revokeAccessToList({ listId, userId, user });

  if (result && isError(result)) {
    return result;
  }

  revalidatePath('/');
  revalidatePath(`/lists/${listId}`);
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

  revalidatePath('/');
  revalidatePath(`/lists/${listId}`);
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
  revalidatePath(`/lists/${listId}`);
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

  revalidatePath('/');
  revalidatePath(`/lists/${listId}`);
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

/**
 * "Anyone with the link" list: a signed-in visitor saves it to their own
 * lists. Only WRITE links grant membership, because membership means edit
 * rights; READ links stay view-only at /sharedList/[token].
 */
export async function joinPublicList(token: string) {
  const session = await auth();

  if (!session) {
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(`/sharedList/${token}`)}`
    );
  }

  const share = await prisma.shareList.findUnique({
    where: { token },
    include: { list: { include: { users: true } } }
  });

  if (!share) {
    notFound();
  }

  if (share.type !== 'WRITE') {
    return { hasError: true, message: 'noPermission' };
  }

  const userId = session!.user.id;
  const alreadyMember = share.list.users.some((u) => u.userId === userId);

  if (!alreadyMember) {
    await prisma.listsOnUsers.create({
      data: { listId: share.listId, userId }
    });
  }

  revalidatePath('/');
  redirect(`/lists/${share.listId}`);
}

