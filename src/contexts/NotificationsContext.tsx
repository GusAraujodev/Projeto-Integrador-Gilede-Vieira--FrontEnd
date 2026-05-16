import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  userId: string;
  orderId: string;
  message: string;
  type: 'order_status';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  read: boolean;
  createdAt: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  getUnreadNotifications: () => Notification[];
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Listen for order status changes
  useEffect(() => {
    const handleOrderStatusChange = (event: CustomEvent) => {
      const { orderId, status, userId } = event.detail;
      
      const statusMessages = {
        pending: '⏳ Seu pedido está aguardando confirmação de pagamento',
        confirmed: '✅ Seu pedido foi confirmado! Estamos preparando com carinho',
        shipped: '📦 Seu pedido foi enviado e está a caminho!',
        delivered: '🎉 Seu pedido foi entregue! Aproveite sua leitura',
        cancelled: '❌ Seu pedido foi cancelado'
      };

      addNotification({
        userId,
        orderId,
        message: statusMessages[status],
        type: 'order_status',
        status
      });
    };

    window.addEventListener('orderStatusChanged', handleOrderStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('orderStatusChanged', handleOrderStatusChange as EventListener);
    };
  }, []);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NOTIF-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    setNotifications(prev =>
      prev.map(notif =>
        notif.userId === user.email ? { ...notif, read: true } : notif
      )
    );
  };

  const getUnreadNotifications = () => {
    if (!user) return [];
    return notifications.filter(notif => notif.userId === user.email && !notif.read);
  };

  const unreadCount = user
    ? notifications.filter(notif => notif.userId === user.email && !notif.read).length
    : 0;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        getUnreadNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used within NotificationsProvider');
  return context;
}