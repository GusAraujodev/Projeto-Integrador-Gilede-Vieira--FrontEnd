import { useEffect } from 'react';
import { toast } from 'sonner';
import { Package } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationsContext';
import { useAuth } from '../../contexts/AuthContext';

export default function NotificationToast() {
  const { getUnreadNotifications } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const handleOrderStatusChange = (event: CustomEvent) => {
      const { userId, status } = event.detail;
      
      // Só mostra toast se for para o usuário logado
      if (userId === user.email) {
        const statusMessages = {
          pending: {
            title: '⏳ Pedido Aguardando Confirmação',
            description: 'Estamos processando seu pagamento'
          },
          confirmed: {
            title: '✅ Pedido Confirmado!',
            description: 'Estamos preparando seu pedido com carinho'
          },
          shipped: {
            title: '📦 Pedido Enviado!',
            description: 'Seu pedido está a caminho'
          },
          delivered: {
            title: '🎉 Pedido Entregue!',
            description: 'Aproveite sua leitura!'
          },
          cancelled: {
            title: '❌ Pedido Cancelado',
            description: 'Seu pedido foi cancelado'
          }
        };

        const statusKey = String(status).toLowerCase() as keyof typeof statusMessages;
        const message = statusMessages[statusKey] ?? statusMessages.pending;
        
        toast(message.title, {
          description: message.description,
          icon: <Package className="size-5" />,
          duration: 5000,
          action: {
            label: 'Ver Pedido',
            onClick: () => {
              window.location.href = '/historico';
            }
          }
        });
      }
    };

    window.addEventListener('orderStatusChanged', handleOrderStatusChange as EventListener);
    
    return () => {
      window.removeEventListener('orderStatusChanged', handleOrderStatusChange as EventListener);
    };
  }, [user]);

  return null;
}
