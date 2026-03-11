import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'info' | 'luxury';

interface Notification {
    id: string;
    message: string;
    type: NotificationType;
}

interface NotificationStore {
    notifications: Notification[];
    showNotification: (message: string, type?: NotificationType) => void;
    hideNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    showNotification: (message, type = 'luxury') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            notifications: [...state.notifications, { id, message, type }],
        }));

        // Auto-hide after 5 seconds
        setTimeout(() => {
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id),
            }));
        }, 5000);
    },
    hideNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        }));
    },
}));
