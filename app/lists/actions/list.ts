'use server';

import { z } from 'zod';
import { auth } from '../../auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ListItem } from '@/models';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';
import { mapArrayToObject, mapObjectToArray } from '@/lib/utils';

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

export async function updateListItems(listId: string, list: ListItem[]) {
  const session = await auth();
  console.log(28, list)
  const existingList = await getList(listId)!;
  const items = existingList?.items as ListItem[];

  const uniqItems = {
    ...mapArrayToObject(items, 'uuid'),
    ...mapArrayToObject(list, 'uuid'),

  }

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
      items: mapObjectToArray<ListItem>(uniqItems)
    }
  });

  // const result = await updateListQuery(listId, list);
}

// export async function getSharedLists() {
//   const session = await auth();
//
//   const result = await getSharedListsQuery();
//
//   return result;
// }
//
// export async function deleteList(id: number) {
//   const result = await deleteListQuery(id);
//
//   return redirect('/');
// }

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

  // await createListQuery(list);
  // const user = await prisma.li.create({
  //   data: {
  //     name: list.name,
  //     items: [],
  //     user_id: 1
  //   }
  // })

  const prisma = new PrismaClient();

  const list2 = await prisma.list.create({
    data: {
      name: list.name,
      items: [],
      ownerId: 1,
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

  console.log(84, list2);

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

  // try {
  //   const result = await shareListQuery(
  //     formData.get('email'),
  //     formData.get('listId')
  //   );
  // } catch (e) {
  //   return 'ok';
  // }

  return 'ok';
}
