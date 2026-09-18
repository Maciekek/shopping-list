import 'server-only';
import { EventEmitter } from 'node:events';

/**
 * In-process pub/sub for "list changed" signals, consumed by the SSE route.
 * The app runs as a single Node process on the VPS, so no external broker is
 * needed. If it is ever scaled to several instances, swap this for Postgres
 * LISTEN/NOTIFY or Redis while keeping the same two functions.
 */
type Listener = (event: ListChangeEvent) => void;

export type ListChangeEvent = {
  listId: string;
  /** Identifies the browser tab that made the change so it can skip its own echo. */
  clientId?: string;
  at: number;
};

const emitter: EventEmitter =
  (globalThis as any).__listEvents ?? new EventEmitter();
emitter.setMaxListeners(0);
(globalThis as any).__listEvents = emitter;

const channel = (listId: string) => `list:${listId}`;

export function publishListChange(listId: string, clientId?: string) {
  emitter.emit(channel(listId), { listId, clientId, at: Date.now() });
}

export function subscribeToList(listId: string, listener: Listener) {
  emitter.on(channel(listId), listener);
  return () => emitter.off(channel(listId), listener);
}
