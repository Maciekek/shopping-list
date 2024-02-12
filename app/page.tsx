'use server'

import { auth } from './auth';
import { getUsersListsQuery } from '@/db/queries';
import { List, User } from '@/models';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSharedLists } from '@/app/api/list';
import SimpleTile from '@/components/ui/simpleTile';

export default async function IndexPage() {
  const session = await auth();
  if(!session) {
    return;
  }
  const result = await getUsersListsQuery(session?.user?.email || '');
  const lists = result.rows as List[];

  const sharedResults = await getSharedLists();
  const sharedList = sharedResults?.rows as List[];
  console.log(25, sharedList);

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

      <div className={'mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4'}>
        {lists.map((list) => (
          <SimpleTile
            key={list.name}
            text={list.name}
            href={`/lists/${list.id}`}
            id={list.id}
          />
        ))}
      </div>

      {sharedList.length > 0 && (
        <>
          <h1 className="text-xl font-bold leading-tight text-gray-900 pt-5">
            Shared With You
          </h1>
          <div className={'mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4'}>
            {sharedList.map((list) => (
              <SimpleTile
                key={list.name}
                text={list.name}
                href={`/lists/${list.id}`}
                id={list.id}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
