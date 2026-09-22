import { db } from '@/db';
import { ListItem } from '@/models';
import _ from 'lodash';
import { User } from 'next-auth';
import { isError } from '@/lib/utils';
import { emailService } from '@/lib/emails';
import { publishListChange } from '@/lib/liveEvents';

/** `message` is a key in the `Errors` namespace of messages/*.json; translate it where it is shown. */
export type ResponseError = { hasError: boolean; message: string };

type ListWithUsersAndShare = {
  ownerId: string | null;
  users: { userId: string }[];
  share: { type: 'READ' | 'WRITE' } | null;
};

const isMember = (list: ListWithUsersAndShare, userId?: string) =>
  !!userId && list.users.some((u) => u.userId === userId);

/**
 * Who may change items: anyone on a public WRITE link, otherwise only a
 * signed-in member. Never rely on Prisma `where` filters with an undefined
 * userId for this: Prisma drops undefined fields, so the filter matches
 * every list.
 */
const canWriteList = (list: ListWithUsersAndShare, user?: User) =>
  list.share?.type === 'WRITE' || isMember(list, user?.id);

const ListService = {
  getList: async ({
    listId,
    userId,
    withUsers = false
  }: {
    listId: string;
    userId?: string;
    withUsers?: boolean;
  }) => {
    const result = await db.lists.getUserList({ listId, userId, withUsers });

    if (isError(result)) {
      return {
        hasError: true,
        message: 'fetchList'
      };
    }

    return result;
  },

  getListById: async ({ listId }: { listId: string }) => {
    return db.lists.getListById({ listId });
  },

  getAllUserLists: async ({ userId }: { userId: string }) => {
    return db.lists.getUserLists({ userId });
  },

  updateList: async ({
    listId,
    user,
    newItems,
    clientId
  }: {
    listId: string;
    user?: User;
    newItems: ListItem[];
    clientId?: string;
  }) => {
    const existingList = await ListService.getListById({
      listId
    });

    if (!existingList || isError(existingList)) {
      return {
        hasError: true,
        message: 'listNotFound'
      };
    }

    if (!canWriteList(existingList, user)) {
      return {
        hasError: true,
        message: 'noPermission'
      };
    }

    const items = existingList?.items as ListItem[];

    const updatedList = [...newItems].reduce(
      (acc: { active: ListItem[]; finished: ListItem[] }, item) => {
        if (item.selected) {
          return { ...acc, finished: [...acc.finished, item] };
        }

        return { ...acc, active: [...acc.active, item] };
      },
      { active: [], finished: [] }
    );

    const updateListResult = await db.lists.updateListItems({
      listId,
      items: _.uniqBy(
        [...updatedList.active, ...updatedList.finished, ...items],
        'uuid'
      )
    });

    if (isError(updateListResult)) {
      return {
        hasError: true,
        message: 'updateList'
      };
    }

    publishListChange(listId, clientId);

    return {
      hasError: false,
      message: 'List updated successfully'
    };
  },

  deleteItemFromList: async ({
    listId,
    itemId,
    user,
    clientId
  }: {
    listId: string;
    itemId: string;
    user: User;
    clientId?: string;
  }) => {
    const existingList = await ListService.getListById({
      listId
    });

    if (!existingList || isError(existingList)) {
      return {
        hasError: true,
        message: 'listNotFound'
      };
    }

    if (!canWriteList(existingList, user)) {
      return {
        hasError: true,
        message: 'noPermission'
      };
    }

    const items = existingList?.items as ListItem[];

    const updatedList = items.filter((item) => item.uuid !== itemId);
    const updateListResult = await db.lists.updateListItems({
      listId,
      items: updatedList
    });

    if (isError(updateListResult)) {
      return {
        hasError: true,
        message: 'updateList'
      };
    }

    publishListChange(listId, clientId);

    return {
      hasError: false,
      message: 'List updated successfully'
    };
  },


  deleteList: async ({
    listId,
    userId
  }: {
    listId: string;
    userId: string;
  }) => {
    const result = await db.lists.deleteList({ listId, userId });

    if (isError(result)) {
      return {
        hasError: true,
        message: 'deleteList'
      };
    }
  },

  createList: async ({ name, userId }: { name: string; userId: string }) => {
    return db.lists.createList({ name, userId });
  },

  grantAccessToList: async ({
    listId,
    email,
    user
  }: {
    listId: string;
    email: string;
    user: User;
  }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });
    if (!list || isError(list)) {
      return { hasError: true, message: 'noAccess' };
    }

    if (list.invites.some((i) => i.email === email)) {
      return { hasError: true, message: 'alreadyInvited' };
    }

    const existing = await db.lists.findUserByEmail({ email });
    if (isError(existing)) {
      return existing;
    }

    // No account yet: keep a pending invite, claimed on their first sign-in,
    // and send an invitation to the app instead of a "list shared" note.
    if (!existing) {
      const invite = await db.lists.createInvite({ listId, email, invitedById: user.id! });
      if (isError(invite)) {
        return invite;
      }

      await emailService.sendInviteEmail({
        to: email,
        from: user.email!,
        // Token link: works even if they sign in with a different Google address.
        appUrl: `${process.env.NEXTAUTH_URL}/i/${invite.token}`,
        listName: list.name
      });

      return { invited: true as const };
    }

    const result = await db.lists.grantAccess({ listId, email, user });

    if (isError(result)) {
      return result;
    }

    await emailService.sendShareEmail({
      to: email,
      from: user.email!,
      listUrl: `${process.env.NEXTAUTH_URL}/lists/${listId}`,
      listName: result.name
    });

    return { invited: false as const };
  },

  createInviteLink: async ({ listId, user }: { listId: string; user: User }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });
    if (!list || isError(list)) {
      return { hasError: true, message: 'noAccess' };
    }

    return db.lists.createInviteLink({ listId, invitedById: user.id! });
  },

  revokeInvite: async ({ listId, inviteId, user }: { listId: string; inviteId: string; user: User }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });
    if (!list || isError(list)) {
      return { hasError: true, message: 'noAccess' };
    }

    const result = await db.lists.deleteInvite({ inviteId, listId });
    if (isError(result)) {
      return { hasError: true, message: 'revokeAccess' };
    }
  },

  revokeAccessToList: async ({
    listId,
    userId,
    user
  }: {
    listId: string;
    userId: string;
    user: User;
  }) => {
    const list = await db.lists.getListById({ listId, ownerId: undefined });

    if (isError(list) || !list) {
      return {
        hasError: true,
        message: 'noAccess'
      };
    }

    // The owner may remove anyone but themselves; a member may only leave.
    const userIsOwner = list.ownerId === user.id;
    const isLeaving = userId === user.id && isMember(list, user.id);
    const removingOwner = userId === list.ownerId;

    if (removingOwner || !(userIsOwner || isLeaving)) {
      return {
        hasError: true,
        message: 'notOwner'
      };
    }

    const result = await db.lists.revokeAccess({ listId, userId });

    if (isError(result)) {
      return {
        hasError: true,
        message: 'revokeAccess'
      };
    }
  },

  makeListPublic: async ({ listId, user }: { listId: string; user: User }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });

    if (!list || isError(list)) {
      return {
        hasError: true,
        message: 'noAccess'
      };
    }

    return db.lists.makeListPublic({ listId });
  },

  changePublicListRole: async ({
    listId,
    user,
    accessType
  }: {
    listId: string;
    user: User;
    accessType: 'READ' | 'WRITE';
  }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });

    if (isError(list) || !list) {
      return {
        hasError: true,
        message: 'noAccess'
      };
    }

    return db.lists.updateSharedListRequiredPermission({
      listId,
      requiredPermission: accessType
    });
  },

  makeListProtected: async ({
    listId,
    user
  }: {
    listId: string;
    user: User;
  }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });

    if (!list || isError(list)) {
      return {
        hasError: true,
        message: 'noAccess'
      };
    }

    return db.lists.makeListProtected({ listId, user });
  }
};

export default ListService;
