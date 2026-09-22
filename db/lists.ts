import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { ListItem } from '@/models';
import { ResponseError } from '@/services/ListService';
import { randomBytes } from 'node:crypto';
import { User } from 'next-auth';

const INVITE_SELECT = {
  id: true,
  email: true,
  token: true,
  expiresAt: true,
  uses: true
} as const;

export const INVITE_TTL_DAYS = 30;
const inviteExpiry = () =>
  new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
const inviteToken = () => randomBytes(16).toString('hex');

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
        invites: { where: { claimedAt: null }, select: INVITE_SELECT }
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
        invites: { where: { claimedAt: null }, select: INVITE_SELECT }
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
        invites: { where: { claimedAt: null }, select: INVITE_SELECT }
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
      create: { listId, email, invitedById, token: inviteToken(), expiresAt: inviteExpiry() },
      update: { expiresAt: inviteExpiry(), claimedAt: null }
    });
  }
);

/** Link invite: no e-mail, anyone who opens it and signs in joins. */
export const createInviteLink = withPrismaError(
  ({ listId, invitedById }: { listId: string; invitedById: string }) => {
    return prisma.listInvite.create({
      data: { listId, invitedById, token: inviteToken(), expiresAt: inviteExpiry() }
    });
  }
);

export const getInviteByToken = withPrismaError(
  ({ token }: { token: string }) => {
    return prisma.listInvite.findUnique({
      where: { token },
      include: {
        list: { select: { id: true, name: true, ownerId: true, users: { select: { userId: true } } } }
      }
    });
  }
);

/**
 * Membership for the signed-in user via an invite link. An e-mail invite is
 * single-use and removed; a link invite stays until expiry or withdrawal.
 */
export const claimInviteByToken = withPrismaError(
  async ({ token, userId }: { token: string; userId: string }) => {
    const invite = await prisma.listInvite.findUnique({ where: { token } });
    if (!invite || invite.expiresAt < new Date()) return null;
    // A claimed e-mail invite is single-use; only the person who claimed it may reopen it.
    if (invite.claimedAt) {
      const member = await prisma.listsOnUsers.findUnique({
        where: { userId_listId: { userId, listId: invite.listId } }
      });
      return member ? invite.listId : null;
    }

    await prisma.$transaction([
      prisma.listsOnUsers.createMany({
        data: [{ listId: invite.listId, userId }],
        skipDuplicates: true
      }),
      prisma.listInvite.update({
        where: { id: invite.id },
        data: invite.email ? { claimedAt: new Date(), uses: { increment: 1 } } : { uses: { increment: 1 } }
      })
    ]);

    return invite.listId;
  }
);

export const deleteInvite = withPrismaError(
  ({ inviteId, listId }: { inviteId: string; listId: string }) => {
    return prisma.listInvite.delete({ where: { id: inviteId, listId } });
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
