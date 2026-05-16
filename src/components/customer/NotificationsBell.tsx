import { useState } from 'react';
import { Bell, Package, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationsContext';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export default function NotificationsBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, getUnreadNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const unreadNotifications = getUnreadNotifications();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ontem';
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-900 dark:text-white">
            Notificações
          </h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {unreadNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="size-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Nenhuma notificação nova
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {unreadNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={`/pedido/${notification.orderId}`}
                  onClick={() => handleNotificationClick(notification.id)}
                  className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="size-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                        <Package className="size-5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Pedido #{notification.orderId.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="size-2 rounded-full bg-purple-600" />
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>

        {unreadNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Link to="/historico" onClick={() => setOpen(false)}>
                <Button variant="ghost" className="w-full text-sm">
                  Ver todos os pedidos
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
