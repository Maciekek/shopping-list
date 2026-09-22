import Navbar from './navbar';
import { auth } from './auth';
import { isAdminEmail } from '@/lib/admin';
import { touchLastSeen } from '@/lib/activity';

export default async function Nav() {
  const session = await auth();
  if (session?.user?.id) await touchLastSeen(session.user.id);

  return (
    <Navbar user={session?.user} isAdmin={isAdminEmail(session?.user?.email)} />
  );
}
