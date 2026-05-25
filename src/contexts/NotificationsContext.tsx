import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  userId: string;
  orderId: string;
  message: string;
  type: string;
  status: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  getUnreadNotifications: () => Notification[];
  refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
const API = import.meta.env.VITE_API_URL || 'https://livraria-backend-1m69.onrender.com';
const POLL_MS = 30_000; // polling a cada 30 segundos

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    const token = localStorage.getItem('gilede_jwt');
    if (!token) return;
    try {
      const res = await fetch(`${API}/notifications/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json() as Notification[];
      setNotifications(data);
    } catch {
      // silencia erro de rede — tenta de novo no próximo ciclo
    }
  }, [user?.id]);

  // Busca inicial + polling enquanto logado
  useEffect(() => {
    if (!user?.id) {
      setNotifications([]);
      return;
    }
    fetchNotifications();
    timerRef.current = setInterval(fetchNotifications, POLL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user?.id, fetchNotifications]);

  // Escuta mudanças de status de pedido disparadas localmente (admin painel)
  useEffect(() => {
    const handler = () => { void fetchNotifications(); };
    window.addEventListener('orderStatusChanged', handler);
    return () => window.removeEventListener('orderStatusChanged', handler);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('gilede_jwt');
    if (!token) return;
    try {
      await fetch(`${API}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch { /* ignora */ }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    const token = localStorage.getItem('gilede_jwt');
    if (!token) return;
    try {
      await fetch(`${API}/notifications/read-all/${user.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* ignora */ }
  };

  const getUnreadNotifications = () =>
    notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount,
      markAsRead, markAllAsRead,
      getUnreadNotifications,
      refresh: fetchNotifications,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
