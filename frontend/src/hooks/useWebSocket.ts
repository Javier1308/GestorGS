import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useRealtimeStore } from '../store/realtimeStore';
import { useNotificationStore } from '../store/notificationStore';

// Convierte http(s):// a ws(s):// y agrega el path STOMP
const rawWsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080';
const WS_URL = rawWsUrl.replace(/^http/, 'ws') + '/ws';

export function useWebSocket() {
  const clientRef = useRef<Client | null>(null);
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { setConnected, triggerPaymentUpdate, triggerWorkOrderUpdate } =
    useRealtimeStore();
  const addToast = useNotificationStore((s) => s.addToast);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    const client = new Client({
      brokerURL: WS_URL,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        setConnected(true);

        // Subscribe to payment updates
        client.subscribe('/topic/payments', () => {
          triggerPaymentUpdate();
          queryClient.invalidateQueries({ queryKey: ['payments'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        });

        // Subscribe to work order updates
        client.subscribe('/topic/workorders', () => {
          triggerWorkOrderUpdate();
          queryClient.invalidateQueries({ queryKey: ['workOrders'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        });

        // Subscribe to personal notifications
        client.subscribe('/user/queue/notifications', (message) => {
          try {
            const notification = JSON.parse(message.body);
            addToast('info', notification.title, notification.message);
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          } catch {
            // ignore parse errors
          }
        });
      },

      onDisconnect: () => {
        setConnected(false);
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
        setConnected(false);
      },

      onWebSocketError: () => {
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
      setConnected(false);
    };
  }, [
    isAuthenticated,
    accessToken,
    queryClient,
    setConnected,
    triggerPaymentUpdate,
    triggerWorkOrderUpdate,
    addToast,
  ]);

  return clientRef;
}
