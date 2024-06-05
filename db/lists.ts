import prisma from '@/lib/prisma';
import { ListItem } from '@/models';
import { ResponseError } from '@/services/ListService';
import { randomBytes } from 'node:crypto';
import { User } from 'next-auth';

type FuncWithArgs<T extends unknown[], R> = (...args: T) => R;

type AnyFunction = (...args: any[]) => any;

function withPrismaError<T extends AnyFunction>(
  func: T
): (...args: Parameters<T>) => Promise<ReturnType<T> | ResponseError> {
  return async (
    ...args: Parameters<T>
  ): Promise<ReturnType<T> | ResponseError> => {
    try {
      return await func(...args);
    } catch (e) {
      console.error(e);
      return {
        hasError: true,
        message: 'DB error occurred'
      };
    }
  };
}

export const getUserList = withPrismaError(
  async ({
    listId,
    userId,
    withUsers = false
  }: {
    listId: string;
    userId?: string;
    withUsers?: boolean;
  }) => {
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
        share: true
      }
    });

    return result;
  }
);

export const getListById = withPrismaError(
  async ({ listId, ownerId }: { listId: string; ownerId?: string }) => {
    return prisma.list.findUnique({
      where: {
        id: listId,
        ownerId
      },
      include: {
        users: true,
        share: true
      }
    });
  }
);

export const getUserLists = withPrismaError(
  ({ userId }: { userId: string }) => {
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
);

export const updateListItems = withPrismaError(
  async ({
    listId,
    items,
    userId
  }: {
    listId: string;
    items: ListItem[];
    userId?: string;
  }) => {
    return prisma.list.update({
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
  }
);

export const deleteList = withPrismaError(
  ({ listId, userId }: { listId: string; userId: string }) => {
    return prisma.list.delete({
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
);

export const createList = withPrismaError(
  ({ name, userId }: { name: string; userId: string }) => {
    return prisma.list.create({
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
);

export const grantAccess = withPrismaError(
  ({ listId, email, user }: { listId: string; email: string, user: User }) => {
    return prisma.list.update({
      where: {
        id: listId,
        ownerId: user.id
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
);

export const revokeAccess = withPrismaError(
  ({ listId, userId }: { listId: string; userId: string }) => {
    return prisma.listsOnUsers.delete({
      where: {
        userId_listId: {
          listId,
          userId
        },
      }
    });
  }
);

export const updateSharedListRequiredPermission = withPrismaError(
  ({
    listId,
    requiredPermission
  }: {
    listId: string;
    requiredPermission: 'READ' | 'WRITE';
  }) => {
    return prisma.shareList.update({
      where: {
        listId
      },
      data: {
        type: requiredPermission
      }
    });
  }
);

export const makeListPublic = withPrismaError(
  ({ listId }: { listId: string }) => {
    return prisma.shareList.create({
      data: {
        type: 'READ',
        token: randomBytes(3).toString('hex'),
        list: {
          connect: {
            id: listId
          }
        }
      }
    });
  }
);
export const makeListProtected = withPrismaError(
  ({ listId, user }: { listId: string; user: User }) => {
    return prisma.shareList.delete({
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
  }
);
