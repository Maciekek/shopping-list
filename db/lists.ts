import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
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
        message: 'dbError'
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
        users: withUsers
          ? { include: { user: { select: { email: true, id: true } } } }
          : false,
        share: true,
        invites: { select: { id: true, email: true } }
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
        share: true,
        invites: { select: { id: true, email: true } }
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
        },
        invites: { select: { id: true, email: true } }
      }
    });
  }
);

/** Authorization happens in ListService.canWriteList; this only writes. */
export const updateListItems = withPrismaError(
  async ({ listId, items }: { listId: string; items: ListItem[] }) => {
    return prisma.list.update({
      where: {
        id: listId
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

export const grantAccess = async ({
  listId,
  email,
  user
}: {
  listId: string;
  email: string;
  user: User;
}) => {
  try {
    return await prisma.list.update({
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // (userId, listId) already exists
      if (e.code === 'P2002') {
        return { hasError: true, message: 'alreadyShared' };
      }
      // connect by email found no user, or list not owned by current user
      if (e.code === 'P2025') {
        return { hasError: true, message: 'noAccount' };
      }
    }
    console.error(e);
    return { hasError: true, message: 'dbError' };
  }
};

export const findUserByEmail = withPrismaError(
  ({ email }: { email: string }) => {
    return prisma.user.findUnique({ where: { email }, select: { id: true } });
  }
);

/** Pending share for an address with no account yet; owner check is done by the caller. */
export const createInvite = withPrismaError(
  ({ listId, email, invitedById }: { listId: string; email: string; invitedById: string }) => {
    return prisma.listInvite.upsert({
      where: { listId_email: { listId, email } },
      create: { listId, email, invitedById },
      update: {}
    });
  }
);

export const deleteInvite = withPrismaError(
  ({ inviteId, listId }: { inviteId: string; listId: string }) => {
    return prisma.listInvite.delete({ where: { id: inviteId, listId } });
  }
);

/**
 * Turns every pending invite for `email` into a membership and removes the
 * invites. Called from the sign-in event, so it must never throw.
 */
export const claimInvites = async ({ userId, email }: { userId: string; email: string }) => {
  try {
    const invites = await prisma.listInvite.findMany({ where: { email } });
    if (invites.length === 0) return 0;

    await prisma.$transaction([
      prisma.listsOnUsers.createMany({
        data: invites.map((i) => ({ listId: i.listId, userId })),
        skipDuplicates: true
      }),
      prisma.listInvite.deleteMany({ where: { email } })
    ]);
    return invites.length;
  } catch (e) {
    console.error('[invites] claim failed for user', userId, e);
    return 0;
  }
};

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
        // 128 bits: the link is the only secret for public lists
        token: randomBytes(16).toString('hex'),
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
