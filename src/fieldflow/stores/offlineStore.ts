import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineState {
  isOffline: boolean;
  isSimulated: boolean;
  lastOnlineAt: string | null;
  setOffline: (offline: boolean, simulated?: boolean) => void;
  toggleSimulated: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set, get) => ({
      isOffline: !navigator.onLine,
      isSimulated: false,
      lastOnlineAt: navigator.onLine ? new Date().toISOString() : null,

      setOffline: (offline, simulated = false) =>
        set({
          isOffline: offline,
          isSimulated: simulated,
          lastOnlineAt: offline ? get().lastOnlineAt : new Date().toISOString(),
        }),

      toggleSimulated: () => {
        const current = get().isOffline;
        set({
          isOffline: !current,
          isSimulated: true,
          lastOnlineAt: current ? new Date().toISOString() : get().lastOnlineAt,
        });
      },
    }),
    { name: 'fieldflow-offline' }
  )
);

// Hook into browser online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    const store = useOfflineStore.getState();
    if (!store.isSimulated) store.setOffline(false);
  });
  window.addEventListener('offline', () => {
    const store = useOfflineStore.getState();
    if (!store.isSimulated) store.setOffline(true);
  });
}
