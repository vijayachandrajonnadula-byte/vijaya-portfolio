import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '../types';
import { mockNotifications } from '../data';

interface NotificationState {
  notifications: Notification[];
  unreadCount: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read' | 'dismissed'>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,

      unreadCount: () =>
        get().notifications.filter((n) => !n.read && !n.dismissed).length,

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      dismiss: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, dismissed: true, read: true } : n
          ),
        })),

      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `notif-${Date.now()}`,
              timestamp: new Date().toISOString(),
              read: false,
              dismissed: false,
            },
            ...state.notifications,
          ],
        })),
    }),
    { name: 'fieldflow-notifications' }
  )
);
