import Navbar from './navbar';
import { auth } from './auth';
import { isAdminEmail } from '@/lib/admin';

export default async function Nav() {
  const session = await auth();

  return (
    <Navbar user={session?.user} isAdmin={isAdminEmail(session?.user?.email)} />
  );
}
