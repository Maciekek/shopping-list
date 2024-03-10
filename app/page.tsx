import { auth } from '@/app/auth';
import { getLists } from '@/app/lists/actions/list';
import { NotInLoggedHero } from '@/components/molecules/NotInLoggedHero';
import { Lists } from '@/components/molecules/Lists';
import { NoListsHero } from '@/components/molecules/NoListsHero';

export default async function IndexPage() {
  const session = await auth();
  const userLists = await getLists();

  const user = session?.user;

  if (!session) {
    return <NotInLoggedHero />;
  }

  if (userLists.length > 0) {
    return <Lists user={user} lists={userLists}/>;
  }

  return (
    <NoListsHero/>
  )
}

