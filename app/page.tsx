import { sql } from '@vercel/postgres';
import { Card, Title, Text } from '@tremor/react';
import { auth } from './auth';
import { getUsersListsQuery } from './db/queries';
import { List, User } from './models';
import { SimpleTile } from './ui/SimpleTile';
import Link from 'next/link';
import { Button } from './ui/Button';

export default async function IndexPage() {
  const session = await auth();

  const result = await getUsersListsQuery(session?.user?.email || '');
  const lists = result.rows as List[];
  console.log(25, lists);

  if (!session) {
    return (
      <main className="overflow-hidden ">
        <div className="flex-1 space-y-4 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Please login :)</h2>
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
            <Button>
              <Link href={'/lists/create'}>Create new list</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className={'mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4'}>
        {lists.map((list) => (
          <SimpleTile key={list.name} text={list.name} href={`lists/${list.id}`}></SimpleTile>
        ))}
      </div>
    </main>
  );
}
