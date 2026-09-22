import prisma from '@/lib/prisma';

// Imported from app/auth.ts, which is bundled for the edge middleware too,
// so this module must stay free of Node-only imports (no node:crypto etc.).

/**
 * Turns every pending invite for `email` into a membership and removes the
 * invites. Called from the sign-in event, so it must never throw.
 */
export const claimInvites = async ({ userId, email }: { userId: string; email: string }) => {
  try {
    const invites = await prisma.listInvite.findMany({
      where: { email, expiresAt: { gt: new Date() } }
    });
    // Expired e-mail invites are dropped without granting anything.
    await prisma.listInvite.deleteMany({ where: { email } });
    if (invites.length === 0) return 0;

    await prisma.listsOnUsers.createMany({
      data: invites.map((i) => ({ listId: i.listId, userId })),
      skipDuplicates: true
    });
    return invites.length;
  } catch (e) {
    console.error('[invites] claim failed for user', userId, e);
    return 0;
  }
};
