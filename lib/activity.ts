import 'server-only';
import prisma from '@/lib/prisma';

const TOUCH_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Marks the user as active now. Sessions are 30-day JWTs, so sign-ins say
 * little about usage; this runs on every page render with a session and
 * writes at most once per TOUCH_INTERVAL_MS per user.
 */
export async function touchLastSeen(userId: string) {
  const threshold = new Date(Date.now() - TOUCH_INTERVAL_MS);
  try {
    await prisma.user.updateMany({
      where: {
        id: userId,
        OR: [{ lastSeenAt: null }, { lastSeenAt: { lt: threshold } }]
      },
      data: { lastSeenAt: new Date() }
    });
  } catch (e) {
    console.error('[activity] touchLastSeen failed', e);
  }
}
