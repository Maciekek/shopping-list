import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

import ListTile from '@/components/molecules/ListTile';
import { auth } from '@/app/auth';
import { getLists } from '@/app/lists/actions/list';

export default async function IndexPage() {
  const session = await auth();
  const userLists = await getLists();

  const userId = session?.user?.id;


  if (!session) {
    return (
      <main className="overflow-hidden ">
        <div className="flex-1 space-y-4 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Please login :)
            </h2>
            <div className="flex items-center space-x-2"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden ">
      <div className="flex-1 space-y-4 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Your lists</h2>
          <div className="flex items-center space-x-2">
            <Link href={'/lists/create'}>
              <Button>Create new list</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className={'mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3'}>
        {userLists.map((userList) => (
          <ListTile
            key={userList.name}
            text={userList.name}
            href={`/lists/${userList.id}`}
            id={userList.id}
            ownerEmail={userList.users.filter((user) => user.userId === userList.ownerId)[0]?.user.email || ''}
            status={userId === userList.ownerId ? 'owner' : 'shared'}
          />
        ))}
      </div>
    </main>
  );
}
