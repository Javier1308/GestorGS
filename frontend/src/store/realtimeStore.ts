import { create } from 'zustand';

interface RealtimeState {
  isConnected: boolean;
  onlineUsers: number;
  lastPaymentUpdate: number;
  lastWorkOrderUpdate: number;
  setConnected: (connected: boolean) => void;
  setOnlineUsers: (count: number) => void;
  triggerPaymentUpdate: () => void;
  triggerWorkOrderUpdate: () => void;
}

export const useRealtimeStore = create<RealtimeState>((set) => ({
  isConnected: false,
  onlineUsers: 0,
  lastPaymentUpdate: 0,
  lastWorkOrderUpdate: 0,

  setConnected: (connected) => set({ isConnected: connected }),
  setOnlineUsers: (count) => set({ onlineUsers: count }),
  triggerPaymentUpdate: () => set({ lastPaymentUpdate: Date.now() }),
  triggerWorkOrderUpdate: () => set({ lastWorkOrderUpdate: Date.now() }),
}));
