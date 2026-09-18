'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

/**
 * Subscribes to the list's SSE stream and refreshes the server components
 * when someone else changes the list. Returns a per-tab clientId that the
 * mutating actions pass along, so this tab ignores echoes of its own edits.
 */
export function useLiveList(listId: string) {
  const router = useRouter();
  const clientId = useMemo(() => uuidv4(), []);

  useEffect(() => {
    const source = new EventSource(`/api/lists/${listId}/events`);

    const onChange = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as { clientId: string | null };
        if (data.clientId === clientId) return;
      } catch {
        // malformed event, refresh anyway
      }
      router.refresh();
    };

    source.addEventListener('change', onChange);

    return () => {
      source.removeEventListener('change', onChange);
      source.close();
    };
  }, [listId, clientId, router]);

  return clientId;
}
