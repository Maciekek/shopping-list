import { auth } from '@/app/auth';

import { NotInLoggedHero } from '@/components/molecules/NotInLoggedHero';
import { Lists } from '@/components/molecules/Lists';
import { NoListsHero } from '@/components/molecules/NoListsHero';
import { UserLists } from '@/models';
import { User } from 'next-auth';
import { getUserLists } from '@/actions/lists';
import { isError } from '@/lib/utils';

export default async function IndexPage() {
  const session = await auth();

  if (!session) {
    return <NotInLoggedHero />;
  }

  const userLists = await getUserLists();
  const user: User = session!.user!;

  if(isError(userLists)) {
    return <NoListsHero />;
  }

  if (userLists.length > 0) {
    return <Lists user={user} lists={userLists} />;
  }

  return <NoListsHero />;
}
