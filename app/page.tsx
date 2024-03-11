import { auth } from '@/app/auth';
import { getUserLists } from '@/app/lists/actions/list';
import { NotInLoggedHero } from '@/components/molecules/NotInLoggedHero';
import { Lists } from '@/components/molecules/Lists';
import { NoListsHero } from '@/components/molecules/NoListsHero';
import { UserLists } from '@/models';
import { User } from 'next-auth';


export default async function IndexPage() {
  const session = await auth();
  const userLists: UserLists = await getUserLists();

  if (!session) {

    return <NotInLoggedHero />;
  }

  const user: User = session!.user!;

  if (userLists.length > 0) {
    return <Lists user={user} lists={userLists}/>;
  }

  return (
    <NoListsHero/>
  )
}

