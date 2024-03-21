'use server';

import { z } from 'zod';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { List, ListItem } from '@/models';
import prisma from '@/lib/prisma';
import _, { isObject } from 'lodash';
import { auth } from '@/app/auth';
import { db } from '@/db';
import { randomBytes } from 'node:crypto';

const getCurrentUserOrThrowError = async () => {
  const session = await auth();
  if (!session) {
    throw new Error('Not allowed operation. User is not logged in');
  }

  return session.user;
};

export async function getList(listId: string, withUsers = false) {
  const user = await getCurrentUserOrThrowError();
  const list = await db.lists.getList({ listId, userId: user.id, withUsers });
  return list;
}

export async function getUserLists() {
  const user = await getCurrentUserOrThrowError();

  return db.lists.getUserLists({ userId: user.id });
}

export async function updateListItems(
  listId: string,
  list: ListItem[],
  isPublicList: boolean = false
) {
  const session = await auth();
  if (!session && !isPublicList) {
    return;
  }

  const existingList: List = await db.lists.getList({
    listId,
    userId: isPublicList ? undefined : session!.user.id,
    withUsers: true
  });

  if (
    (!isObject(existingList?.share) && isPublicList) ||
    (isObject(existingList?.share) &&
      existingList?.share.type === 'READ' &&
      !existingList?.users.find((u) => u.userId === session?.user.id))
  ) {
    return;
  }

  const items = existingList?.items as ListItem[];

  const updatedList = [...list].reduce(
    (acc: { active: ListItem[]; finished: ListItem[] }, item) => {
      if (item.selected) {
        return { ...acc, finished: [...acc.finished, item] };
      }

      return { ...acc, active: [...acc.active, item] };
    },
    { active: [], finished: [] }
  );

  await db.lists.updateListItems({
    listId,
    userId: isPublicList ? undefined : session!.user.id,
    items: _.uniqBy(
      [...updatedList.active, ...updatedList.finished, ...items],
      'uuid'
    )
  });

  revalidatePath(`/lists/${listId}`);
}

export async function deleteList(listId: string) {
  const user = await getCurrentUserOrThrowError();
  await db.lists.deleteList({ listId, userId: user.id });

  return redirect('/');
}

export async function createListAction(previousState: any, formData: any) {
  const user = await getCurrentUserOrThrowError();
  const schema = z.object({
    name: z.string().min(3).max(60)
  });

  const validatedFields = schema.safeParse({
    name: formData.get('name')
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const listName = formData.get('name') ? formData.get('name')! : '';

  await db.lists.createList({ name: listName, userId: user.id });

  revalidatePath('/');
  redirect('/');
}

// TODO: check if I have access to this list
// TODO: send mail with invitation to list, or with notification
export async function shareList(previousState: any, formData: any) {
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
      success: false,
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  try {
    await db.lists.grantAccess({
      listId: formData.get('listId'),
      email: formData.get('email')
    });
  } catch (e) {
    return {
      success: false,
      error: 'User with this email does not exist.'
    };
  }

  revalidatePath('/');
  return {
    success: true
  };
}

export async function revokeAccessToList(userId: string, listId: string) {
  const currentUser = await getCurrentUserOrThrowError();
  const list = await getList(listId, true);

  if (
    _.isUndefined(list?.users.find((user) => user.userId === currentUser.id))
  ) {
    return {
      success: false,
      error: 'You are not allowed to revoke access to this list'
    };
  }

  try {
    await db.lists.revokeAccess({ listId, userId });
  } catch (e) {
    return {
      success: false,
      error: 'Error revoking access'
    };
  }

  revalidatePath('/');
  return {
    success: true
  };
}

export async function makeListPublic(
  listId: string,
  accessType: 'READ' | 'WRITE'
) {
  console.time('changePublicListRole');

  const user = await getCurrentUserOrThrowError();

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
      ownerId: user.id
    }
  });

  if (!list) {
    return;
  }

  await prisma.shareList.create({
    data: {
      type: accessType,
      token: randomBytes(3).toString('hex'),

      list: {
        connect: {
          id: listId
        }
      }
    }
  });
  console.timeEnd('changePublicListRole');

  revalidatePath(`/`);
}

export async function changePublicListRole(
  listId: string,
  accessType: 'READ' | 'WRITE'
) {
  console.time('changePublicListRole');

  const user = await getCurrentUserOrThrowError();

  const list = await prisma.list.findUnique({
    where: {
      id: listId,
      ownerId: user.id
    }
  });

  if (!list) {
    return;
  }

  await prisma.shareList.update({
    where: {
      listId
    },
    data: {
      type: accessType
    }
  });
  console.timeEnd('changePublicListRole');
  revalidatePath('/');
}

export async function makeListProtected(listId: string) {
  const user = await getCurrentUserOrThrowError();
  console.time('makeListProtected');
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
      ownerId: user.id
    }
  });

  if (!list) {
    return;
  }

  const result = await prisma.shareList.delete({
    where: {
      listId,
      list: {
        users: {
          some: {
            userId: user.id
          }
        }
      }
    }
  });
  console.timeEnd('makeListProtected');
  console.time('revalidatePath makeListProtected');
  revalidatePath(`/`);
  console.timeEnd('revalidatePath makeListProtected');
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

  return shareList;
}
