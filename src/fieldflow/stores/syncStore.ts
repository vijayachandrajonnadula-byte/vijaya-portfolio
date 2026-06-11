import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyncQueueItem } from '../types';

interface SyncState {
  queue: SyncQueueItem[];
  isSyncing: boolean;
  lastSyncAt: string | null;

  enqueue: (item: Omit<SyncQueueItem, 'id' | 'createdAt' | 'retryCount' | 'status'>) => void;
  markSyncing: (id: string) => void;
  markSynced: (id: string) => void;
  markFailed: (id: string, error: string) => void;
  retryItem: (id: string) => void;
  clearSynced: () => void;
  syncAll: () => Promise<void>;
  pendingCount: () => number;
  failedCount: () => number;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      queue: [],
      isSyncing: false,
      lastSyncAt: null,

      pendingCount: () =>
        get().queue.filter((i) => i.status === 'pending').length,

      failedCount: () =>
        get().queue.filter((i) => i.status === 'failed').length,

      enqueue: (item) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              ...item,
              id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              createdAt: new Date().toISOString(),
              retryCount: 0,
              status: 'pending',
            },
          ],
        })),

      markSyncing: (id) =>
        set((state) => ({
          queue: state.queue.map((i) =>
            i.id === id ? { ...i, status: 'syncing', lastAttemptAt: new Date().toISOString() } : i
          ),
        })),

      markSynced: (id) =>
        set((state) => ({
          queue: state.queue.map((i) =>
            i.id === id ? { ...i, status: 'synced' } : i
          ),
          lastSyncAt: new Date().toISOString(),
        })),

      markFailed: (id, error) =>
        set((state) => ({
          queue: state.queue.map((i) =>
            i.id === id
              ? { ...i, status: 'failed', errorMessage: error, retryCount: i.retryCount + 1 }
              : i
          ),
        })),

      retryItem: (id) =>
        set((state) => ({
          queue: state.queue.map((i) =>
            i.id === id ? { ...i, status: 'pending', errorMessage: undefined } : i
          ),
        })),

      clearSynced: () =>
        set((state) => ({
          queue: state.queue.filter((i) => i.status !== 'synced'),
        })),

      syncAll: async () => {
        const { queue, markSyncing, markSynced, markFailed } = get();
        const pending = queue.filter((i) => i.status === 'pending');
        if (pending.length === 0) return;

        set({ isSyncing: true });
        for (const item of pending) {
          markSyncing(item.id);
          await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
          // Simulate 90% success rate
          if (Math.random() > 0.1) {
            markSynced(item.id);
          } else {
            markFailed(item.id, 'Network timeout. Will retry automatically.');
          }
        }
        set({ isSyncing: false, lastSyncAt: new Date().toISOString() });
      },
    }),
    { name: 'fieldflow-sync' }
  )
);
