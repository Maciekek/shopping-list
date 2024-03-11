import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import ListTile from '@/components/molecules/ListTile';
import { UserList, UserLists } from '@/models';
import { User } from 'next-auth';

export const Lists = ({ lists, user }: { lists: UserLists; user: User }) => {
  return (
    <main className="overflow-hidden ">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Your lists</h2>
          <div className="flex items-center space-x-2">
            <Link prefetch={true} href={'/lists/create'}>
              <Button>Create new list</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className={'mt-4 pb-2 grid gap-3 md:grid-cols-2 lg:grid-cols-3'}>
        {lists.map((userList: UserList) => (
          <ListTile
            key={userList.id}
            user={user}
            list={userList}
          />
        ))}
      </div>
    </main>
  );
};
