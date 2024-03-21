import prisma from '@/lib/prisma';
import { ListItem } from '@/models';

export async function getList({
  listId,
  userId,
  withUsers = false
}: {
  listId: string;
  userId?: string;
  withUsers?: boolean;
}) {
  console.time('getList')
  const result = await prisma.list.findUnique({
    where: {
      id: listId,
      users: {
        some: {
          userId
        }
      }
    },
    include: {
      users: withUsers,
      share: true,
    }
  });

  console.timeEnd('getList');
  return result;
}

export async function getUserLists({ userId }: { userId: string }) {
  return prisma.list.findMany({
    where: {
      users: {
        some: {
          userId
        }
      }
    },
    include: {
      share: {
        select: {
          token: true,
          type: true
        }
      },
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

export async function updateListItems({
  listId,
  items,
  userId
}: {
  listId: string;
  items: ListItem[];
  userId?: string;
}) {
  console.time('updateListItems')

  const result = await prisma.list.update({
    where: {
      id: listId,
      users: {
        some: {
          userId
        }
      }
    },
    data: {
      items: items
    }
  });
  console.timeEnd('updateListItems')
  return result;
}


export async function deleteList({ listId, userId }: { listId: string; userId: string }) {
  await prisma.list.delete({
    where: {
      id: listId,
      ownerId: userId,
      users: {
        some: {
          userId: userId
        }
      }
    }
  });
}

export async function createList({ name, userId }: { name: string; userId: string }) {
  await prisma.list.create({
    data: {
      name: name,
      items: [],
      ownerId: userId,
      users: {
        create: {
          user: {
            connect: {
              id: userId
            }
          }
        }
      }
    }
  });
}

export async function grantAccess({ listId, email }: { listId: string; email: string }) {
  await prisma.list.update({
    where: {
      id: listId
    },
    data: {
      users: {
        create: {
          user: {
            connect: {
              email: email
            }
          }
        }
      }
    }
  });
}

export async function revokeAccess({ listId, userId }: { listId: string; userId: string }) {
  await prisma.listsOnUsers.delete({
    where: {
      userId_listId: {
        listId,
        userId
      }
    }
  });
}
