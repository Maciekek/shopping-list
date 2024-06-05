import { getList, getPublicList, getUserLists } from '@/actions/lists';
import { db } from '@/db';

import type { List as ListA, User as UserA } from '@prisma/client';

export type ListItem = {
  uuid: string;
  name: string;
  selected: boolean;
}

import { Prisma } from '@prisma/client'

export type ListWithUsersAndShare = Prisma.ListGetPayload<{
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
}>

export type SharedWithUser = Prisma.ListsOnUsersGetPayload<{

}>


type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type UserLists = ThenArg<ReturnType<typeof getUserLists>>
export type List = Prisma.ListGetPayload<{}>
export type SharedList = ThenArg<ReturnType<typeof getPublicList>>;
export type ListOrError = ThenArg<ReturnType<typeof getList>>;

