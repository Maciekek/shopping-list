import { NextRequest } from 'next/server';
import { auth } from '@/app/auth';
import { db } from '@/db';
import { isError } from '@/lib/utils';
import { subscribeToList } from '@/lib/liveEvents';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Cloudflare closes idle connections after 100s; a comment line every 25s keeps it open.
const PING_MS = 25_000;

/**
 * Server-Sent Events stream that emits a `change` event whenever the list is
 * modified. Carries no list data: the client re-fetches through the normal,
 * authorized page render. Access: list member, owner, or the list is public.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const listId = params.id;
  const list = await db.lists.getListById({ listId });

  if (!list || isError(list)) {
    return new Response('Not found', { status: 404 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  const isMember =
    !!userId &&
    (list.ownerId === userId || list.users.some((u) => u.userId === userId));
  const isPublic = !!list.share;

  if (!isMember && !isPublic) {
    return new Response('Forbidden', { status: 403 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (chunk: string) => {
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          // stream already closed
        }
      };

      send(`retry: 3000\n\n`);

      const unsubscribe = subscribeToList(listId, (event) => {
        send(
          `event: change\ndata: ${JSON.stringify({
            clientId: event.clientId ?? null,
            at: event.at
          })}\n\n`
        );
      });

      const ping = setInterval(() => send(`: ping\n\n`), PING_MS);

      const close = () => {
        clearInterval(ping);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      request.signal.addEventListener('abort', close);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no'
    }
  });
}
