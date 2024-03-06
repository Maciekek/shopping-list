'use server';

import { z } from 'zod';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ListItem } from '@/models';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';
import _ from 'lodash';

export async function getList(listId: string) {
  const session = await auth();
  return prisma.list.findUnique({
    where: {
      id: listId,
      users: {
        some: {
          userId: session?.user.id
        }
      }
    }
  });
}

export async function getLists() {
  const session = await auth();

  return prisma.list.findMany({
    where: {
      users: {
        some: {
          userId: session?.user?.id,
        },
      }
    },
    include: {
      users: {
        include: {
          user: {
            select: {
              email: true,
              _count: true
            }
          },
        }
      }
    }
  });
}

export async function updateListItems(listId: string, list: ListItem[]) {
  const session = await auth();
  const existingList = await getList(listId)!;
  const items = existingList?.items as ListItem[];
  console.log(56, items)
  console.log(57, list)
  return prisma.list.update({
    where: {
      id: listId,
      users: {
        some: {
          userId: session?.user.id
        }
      }
    },
    data: {
      items: _.uniqBy([...list,...items], 'uuid')
    }
  });
}

export async function deleteList(id: string) {
  const session = await auth();

  const result = await prisma.list.delete({
    where: {
      id,
      users: {
        some: {
          userId: session?.user.id
        }
      }
    }
  });

  console.log(75, result);

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
      errors: validatedFields.error.flatten().fieldErrors
    };
  }

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

  return 'ok';
}
