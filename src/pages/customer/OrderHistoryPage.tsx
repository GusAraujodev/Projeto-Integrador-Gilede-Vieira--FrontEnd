import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders, Order } from '../../contexts/OrdersContext';
import { Badge } from '../../components/ui/badge';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { fetchUserOrders } = useOrders();
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user?.id) {
      const loadUserOrders = async () => {
        const ordersFromApi = await fetchUserOrders(user.id);
        setUserOrders(ordersFromApi.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      };

      void loadUserOrders();
    }
  }, [user, fetchUserOrders]);

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { label: 'Aguardando Confirmação', color: 'bg-yellow-500' };
      case 'confirmed':
        return { label: 'Confirmado', color: 'bg-blue-500' };
      case 'shipped':
        return { label: 'Enviado', color: 'bg-purple-500' };
      case 'delivered':
        return { label: 'Entregue', color: 'bg-green-500' };
      case 'cancelled':
        return { label: 'Cancelado', color: 'bg-red-500' };
      default:
        return { label: status, color: 'bg-gray-500' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
          Faça login para ver seu histórico
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Você precisa estar logado para acessar seu histórico de pedidos.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
        >
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl text-slate-900 dark:text-white mb-2">
          Meus Pedidos
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Acompanhe o status de todos os seus pedidos
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-12 text-center">
          <Package className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
            Nenhum pedido encontrado
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Você ainda não fez nenhum pedido. Que tal começar agora?
          </p>
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
          >
            Ir às Compras
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map(order => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <Link
                key={order.id}
                to={`/pedido/${order.id}`}
                className="block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg text-slate-900 dark:text-white">
                        Pedido #{order.id}
                      </h3>
                      <Badge className={`${statusInfo.color} text-white`}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        <span>
                          {order.address.city}, {order.address.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Itens do pedido:
                    </p>
                    <div className="space-y-1">
                      {order.items.slice(0, 2).map(item => (
                        <p key={item.book.id} className="text-sm text-slate-900 dark:text-white">
                          {item.quantity}x {item.book.title}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          +{order.items.length - 2} {order.items.length - 2 === 1 ? 'item' : 'itens'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      Forma de pagamento:
                    </p>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {order.paymentMethod === 'pix' && 'PIX'}
                      {order.paymentMethod === 'credit' && 'Cartão de Crédito'}
                      {order.paymentMethod === 'debit' && 'Cartão de Débito'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Total:</span>
                  <span className="text-2xl text-slate-900 dark:text-white">
                    R$ {order.total.toFixed(2)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
