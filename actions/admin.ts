'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/admin';
import type { ListItem } from '@/models';

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
        lastLoginAt: true,
        _count: { select: { lists: true, logins: true } }
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
      lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
      loginCount: u._count.logins,
      ownedLists: ownedByUser.get(u.id) ?? 0,
      memberOfLists: u._count.lists
    }))
  };
}

const LOGIN_HISTORY_LIMIT = 50;

/**
 * Everything the admin sees on a single user's page: profile, recent sign-ins
 * and every list they own or are a member of, with the items on each.
 */
export async function getAdminUserDetails(userId: string) {
  const admin = await getAdminUser();
  if (!admin) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      lastLoginAt: true,
      _count: { select: { logins: true } },
      logins: {
        orderBy: { createdAt: 'desc' },
        take: LOGIN_HISTORY_LIMIT,
        select: { id: true, createdAt: true, provider: true }
      },
      lists: {
        select: {
          list: {
            select: {
              id: true,
              name: true,
              items: true,
              ownerId: true,
              share: { select: { type: true } },
              _count: { select: { users: true } }
            }
          }
        }
      }
    }
  });
  if (!user) return null;

  // Owned lists are normally also memberships, but ownerId is the source of
  // truth for ownership, so fetch them separately and merge by id.
  const owned = await prisma.list.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      name: true,
      items: true,
      ownerId: true,
      share: { select: { type: true } },
      _count: { select: { users: true } }
    }
  });

  const byId = new Map<string, (typeof owned)[number]>();
  for (const l of owned) byId.set(l.id, l);
  for (const m of user.lists) byId.set(m.list.id, m.list);

  const ownerIds = [...new Set([...byId.values()].map((l) => l.ownerId).filter(Boolean))] as string[];
  const owners = await prisma.user.findMany({
    where: { id: { in: ownerIds } },
    select: { id: true, email: true, name: true }
  });
  const ownerById = new Map(owners.map((o) => [o.id, o]));

  const lists = [...byId.values()]
    .map((l) => {
      const items = Array.isArray(l.items) ? (l.items as ListItem[]) : [];
      const owner = l.ownerId ? ownerById.get(l.ownerId) : undefined;
      return {
        id: l.id,
        name: l.name,
        isOwner: l.ownerId === userId,
        ownerEmail: owner?.email ?? owner?.name ?? null,
        memberCount: l._count.users,
        shareType: l.share?.type ?? null,
        items: items.map((i) => ({ uuid: i.uuid, name: i.name, selected: !!i.selected }))
      };
    })
    .sort((a, b) => Number(b.isOwner) - Number(a.isOwner) || a.name.localeCompare(b.name));

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
      loginCount: user._count.logins
    },
    logins: user.logins.map((l) => ({
      id: l.id,
      createdAt: l.createdAt.toISOString(),
      provider: l.provider
    })),
    loginHistoryLimit: LOGIN_HISTORY_LIMIT,
    lists
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
