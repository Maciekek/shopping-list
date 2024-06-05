import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import ListTile from '@/components/molecules/ListTile';
import { ListWithUsersAndShare } from '@/models';
import { User } from 'next-auth';

export const Lists = ({
  lists,
  user
}: {
  lists: ListWithUsersAndShare[];
  user: User;
}) => {
  return (
    <main className="overflow-hidden px-4">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Your lists</h2>
          <Link prefetch={true} href={'/lists/create'}>
            <Button>Create new list</Button>
          </Link>
        </div>
      </div>
      <div className={'mt-4 pb-2 grid gap-3 md:grid-cols-2 lg:grid-cols-3'}>
        {lists.map((list: ListWithUsersAndShare) => (
          <ListTile key={list.id} user={user} list={list} />
        ))}
      </div>
    </main>
  );
};
