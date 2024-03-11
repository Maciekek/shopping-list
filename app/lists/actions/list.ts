'use server';

import { z } from 'zod';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ListItem } from '@/models';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';
import _ from 'lodash';

export async function getList(listId: string, withUsers = false) {
  const session = await auth();
  return prisma.list.findUnique({
    where: {
      id: listId,
      users: {
        some: {
          userId: session?.user.id
        }
      }
    },
    include: {
      users: withUsers
    }
  });
}

export async function getUserLists() {
  const session = await auth();

  return prisma.list.findMany({
    where: {
      users: {
        some: {
          userId: session?.user?.id
        }
      }
    },
    include: {
      users: {
        include: {
          user: {
            select: {
              email: true,
              id: true
            }
          }
        }
      }
    }
  });
}

export async function updateListItems(listId: string, list: ListItem[]) {
  const session = await auth();
  const existingList = await getList(listId)!;
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

  await prisma.list.update({
    where: {
      id: listId,
      users: {
        some: {
          userId: session?.user.id
        }
      }
    },
    data: {
      items: _.uniqBy(
        [...updatedList.active, ...updatedList.finished, ...items],
        'uuid'
      )
    }
  });

  revalidatePath(`/lists/${listId}`);
}

export async function deleteList(id: string) {
  const session = await auth();

  await prisma.list.delete({
    where: {
      id,
      ownerId: session?.user.id,
      users: {
        some: {
          userId: session?.user.id
        }
      }
    }
  });

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
      success: false,
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

  const list = {
    name: formData.get('name') ? formData.get('name')! : '',
    items: []
  };

  const prisma = new PrismaClient();

  await prisma.list.create({
    data: {
      name: list.name,
      items: [],
      ownerId: session?.user.id,
      users: {
        create: {
          user: {
            connect: {
              id: session?.user.id
            }
          }
        }
      }
    }
  });

  revalidatePath('/');
  redirect('/');
}

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
    await prisma.list.update({
      where: {
        id: formData.get('listId')
      },
      data: {
        users: {
          create: {
            user: {
              connect: {
                email: formData.get('email')
              }
            }
          }
        }
      }
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
  const session = await auth();
  const list = await getList(listId, true);

  if (
    _.isUndefined(list?.users.find((user) => user.userId === session?.user.id))
  ) {
    return {
      success: false,
      error: 'You are not allowed to revoke access to this list'
    };
  }

  try {
    await prisma.listsOnUsers.delete({
      where: {
        userId_listId: {
          listId,
          userId
        }
      }
    });
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
