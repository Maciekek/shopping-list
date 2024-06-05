import { db } from '@/db';
import { ListItem } from '@/models';
import _, { isObject } from 'lodash';
import { User } from 'next-auth';
import { isError } from '@/lib/utils';
import { emailService } from '@/lib/emails';

export type ResponseError = { hasError: boolean; message: string };

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
        message: 'Error fetching list'
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
    newItems
  }: {
    listId: string;
    user?: User;
    newItems: ListItem[];
  }) => {
    const existingList = await ListService.getListById({
      listId
    });
    console.log(52, 'UPDATE')

    if (!existingList || isError(existingList)) {
      return {
        hasError: true,
        message: 'List not found'
      };
    }

    const isPublicList = isObject(existingList.share);
    const isSharedWithCurrentUser = existingList?.users.find(
      (u) => u.userId === user?.id
    );

    const noWritePermission =
      isPublicList &&
      existingList.share!.type === 'READ' &&
      !isSharedWithCurrentUser;

    if (noWritePermission) {
      return {
        hasError: true,
        message: 'User have no permission to update this list'
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
      userId: existingList?.share?.type === 'WRITE' ? undefined : user?.id,
      items: _.uniqBy(
        [...updatedList.active, ...updatedList.finished, ...items],
        'uuid'
      )
    });

    if (isError(updateListResult)) {
      return {
        hasError: true,
        message: 'Error updating list'
      };
    }

    return {
      hasError: false,
      message: 'List updated successfully'
    };
  },

  deleteItemFromList: async ({
    listId,
    itemId,
    user}: {
    listId: string;
    itemId: string;
    user: User;
  }) => {
    const existingList = await ListService.getListById({
      listId
    });

    if (!existingList || isError(existingList)) {
      return {
        hasError: true,
        message: 'List not found'
      };
    }

    const isPublicList = isObject(existingList.share);
    const isSharedWithCurrentUser = existingList?.users.find(
      (u) => u.userId === user?.id
    );

    const noWritePermission =
      isPublicList &&
      existingList.share!.type === 'READ' &&
      !isSharedWithCurrentUser;

    if (noWritePermission) {
      return {
        hasError: true,
        message: 'User have no permission to update this list'
      };
    }

    const items = existingList?.items as ListItem[];

    const updatedList = items.filter((item) => item.uuid !== itemId);
    const updateListResult = await db.lists.updateListItems({
      listId,
      userId: existingList?.share?.type === 'WRITE' ? undefined : user?.id,
      items: updatedList
    });

    if (isError(updateListResult)) {
      return {
        hasError: true,
        message: 'Error updating list'
      };
    }

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
        message: 'Error deleting list'
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
    const result = await db.lists.grantAccess({ listId, email, user });

    if (isError(result)) {
      return {
        hasError: true,
        message: 'Error granting access to list'
      };
    }

    emailService.sendShareEmail({
      to: email,
      from: user.email!,
      listUrl: `${process.env.NEXTAUTH_URL}/lists/${listId}`
    });
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
        message: 'no-access'
      };
    }

    const userIsOwner = list.ownerId === user.id;
    const isUserInSharedWithList = list.users.find((u) => u.userId === user.id);


    if (list && !userIsOwner && !isUserInSharedWithList) {
      return {
        hasError: true,
        message: 'You are not the owner of this list'
      };
    }

    const result = await db.lists.revokeAccess({ listId, userId });

    if (isError(result)) {
      return {
        hasError: true,
        message: 'Error revoking access to list'
      };
    }
  },

  makeListPublic: async ({ listId, user }: { listId: string; user: User }) => {
    const list = await db.lists.getListById({ listId, ownerId: user.id });

    if (!list || isError(list)) {
      return {
        hasError: true,
        message: 'no-access'
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
        message: 'no-access'
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
        message: 'no-access'
      };
    }

    return db.lists.makeListProtected({ listId, user });
  }
};

export default ListService;
