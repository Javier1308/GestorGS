import { create } from 'zustand';
import type { ToastMessage, NotificationType } from '../types';

interface NotificationState {
  toasts: ToastMessage[];
  addToast: (type: NotificationType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

let toastId = 0;

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],

  addToast: (type, title, message) => {
    const id = String(++toastId);
    set((state) => ({
      toasts: [...state.toasts, { id, type, title, message }],
    }));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 5000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));
