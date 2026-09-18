import 'server-only';
import { auth } from '@/app/auth';

const DEFAULT_ADMINS = ['maciekek@gmail.com'];

/** Admin e-mails from ADMIN_EMAILS (comma-separated); falls back to the owner's address. */
export function adminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim();
  const list = raw ? raw.split(',').map((e) => e.trim().toLowerCase()) : DEFAULT_ADMINS;
  return list.filter(Boolean);
}

export function isAdminEmail(email?: string | null): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}

/** Current session user if they are an admin, otherwise null. */
export async function getAdminUser() {
  const session = await auth();
  const user = session?.user;
  return user && isAdminEmail(user.email) ? user : null;
}
