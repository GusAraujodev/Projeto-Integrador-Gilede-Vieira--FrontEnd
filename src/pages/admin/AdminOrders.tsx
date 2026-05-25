import { useEffect, useState } from 'react';
import { Package, Search, Eye } from 'lucide-react';
import { type Order, useOrders } from '../../contexts/OrdersContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';

export default function AdminOrders() {
  const { orders, updateOrderStatus, fetchAllOrders } = useOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');

  useEffect(() => {
    void fetchAllOrders();
  }, [fetchAllOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusLabels = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };

  const statusColors = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    shipped: 'bg-purple-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500'
  };

  const paymentMethodLabels: Record<string, string> = {
    pix: 'PIX',
    credit: 'Cartão de Crédito',
    debit: 'Cartão de Débito'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-slate-900 dark:text-white mb-2">
          Gerenciar Pedidos
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} no total
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Buscar por ID ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="shipped">Enviados</SelectItem>
              <SelectItem value="delivered">Entregues</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {order.id}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {order.customerEmail}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {new Date(order.createdAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-900 dark:text-white">
                        R$ {order.total.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {paymentMethodLabels[order.paymentMethod]}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Select
                        value={order.status}
                        onValueChange={(value: Order['status']) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <Badge className={statusColors[order.status]}>
                            {statusLabels[order.status]}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="confirmed">Confirmado</SelectItem>
                          <SelectItem value="shipped">Enviado</SelectItem>
                          <SelectItem value="delivered">Entregue</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pedido {order.id}</DialogTitle>
                            <DialogDescription className="text-slate-600 dark:text-slate-400">
                              Visualize todas as informações do pedido
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Customer Info */}
                            <div>
                              <h3 className="text-sm mb-2 text-slate-900 dark:text-white">
                                Informações do Cliente
                              </h3>
                              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                                <p><strong>Nome:</strong> {order.customerName}</p>
                                <p><strong>Email:</strong> {order.customerEmail}</p>
                                <p><strong>Telefone:</strong> {order.customerPhone}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Address */}
                            <div>
                              <h3 className="text-sm mb-2 text-slate-900 dark:text-white">
                                Endereço de Entrega
                              </h3>
                              <div className="text-sm text-slate-600 dark:text-slate-400">
                                <p>
                                  {order.address.street}, {order.address.number}
                                  {order.address.complement && ` - ${order.address.complement}`}
                                </p>
                                <p>
                                  {order.address.neighborhood}, {order.address.city}/{order.address.state}
                                </p>
                                <p>CEP: {order.address.zipCode}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Items */}
                            <div>
                              <h3 className="text-sm mb-2 text-slate-900 dark:text-white">
                                Itens do Pedido
                              </h3>
                              <div className="space-y-2">
                                {order.items.map(item => (
                                  <div
                                    key={item.book.id}
                                    className="flex justify-between text-sm"
                                  >
                                    <span className="text-slate-600 dark:text-slate-400">
                                      {item.quantity}x {item.book.title}
                                    </span>
                                    <span className="text-slate-900 dark:text-white">
                                      R$ {(item.book.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Subtotal</span>
                                <span>
                                  R$ {(order.total / (1 - order.discount)).toFixed(2)}
                                </span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                  <span>Desconto ({order.couponCode})</span>
                                  <span>
                                    -R$ {((order.total / (1 - order.discount)) * order.discount).toFixed(2)}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Frete</span>
                                <span className="text-green-600 dark:text-green-400">Grátis</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span>R$ {order.total.toFixed(2)}</span>
                              </div>
                            </div>

                            <Separator />

                            {/* Payment */}
                            <div>
                              <h3 className="text-sm mb-2 text-slate-900 dark:text-white">
                                Pagamento
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {paymentMethodLabels[order.paymentMethod]}
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="size-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="text-slate-500 dark:text-slate-400">
                      Nenhum pedido encontrado
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
