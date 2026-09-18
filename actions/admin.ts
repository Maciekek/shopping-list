'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin';

export async function getAdminOverview() {
  const admin = await getAdminUser();
  if (!admin) return null;

  const [userCount, listCount, sharedListCount, users, lists] = await Promise.all([
    prisma.user.count(),
    prisma.list.count(),
    prisma.shareList.count(),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: { select: { lists: true, sessions: true } }
      }
    }),
    prisma.list.findMany({ select: { ownerId: true, items: true } })
  ]);

  const ownedByUser = new Map<string, number>();
  let itemCount = 0;
  for (const list of lists) {
    if (list.ownerId) ownedByUser.set(list.ownerId, (ownedByUser.get(list.ownerId) ?? 0) + 1);
    if (Array.isArray(list.items)) itemCount += list.items.length;
  }

  return {
    stats: { userCount, listCount, sharedListCount, itemCount },
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      createdAt: u.createdAt.toISOString(),
      ownedLists: ownedByUser.get(u.id) ?? 0,
      memberOfLists: u._count.lists
    }))
  };
}

/**
 * Removes a user together with everything they own: lists they created
 * (and thereby shares and memberships on those lists, via cascade), their
 * memberships on other people's lists, accounts and sessions.
 */
export async function deleteUserAsAdmin(userId: string) {
  const admin = await getAdminUser();
  if (!admin) return { hasError: true, message: 'noAccess' };
  if (admin.id === userId) return { hasError: true, message: 'cannotDeleteSelf' };

  try {
    await prisma.$transaction([
      prisma.list.deleteMany({ where: { ownerId: userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);
  } catch (e) {
    console.error('[admin] deleteUser failed', e);
    return { hasError: true, message: 'dbError' };
  }

  revalidatePath('/admin');
  return { hasError: false, message: 'ok' };
}
