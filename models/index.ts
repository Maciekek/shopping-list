import { getList, getUserLists } from '@/app/lists/actions/list';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
}

export type ListItem = {
  uuid: string;
  name: string;
  selected: boolean;
}


type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type UserLists = ThenArg<ReturnType<typeof getUserLists>>
export type ShareWithUser = UserLists[number]['users']
export type UserList = UserLists[number]
export type List = ThenArg<ReturnType<typeof getList>>;


