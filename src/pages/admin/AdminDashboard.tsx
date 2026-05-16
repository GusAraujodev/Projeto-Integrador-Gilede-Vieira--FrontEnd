import { BookOpen, Package, AlertCircle, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import { useOrders } from '../../contexts/OrdersContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { books } = useBooks();
  const { orders } = useOrders();

  const activeBooks = books.filter(b => b.active);
  const pausedBooks = books.filter(b => !b.active);
  const lowStockBooks = books.filter(b => b.stock < 5 && b.stock > 0);
  const outOfStockBooks = books.filter(b => b.stock === 0);

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      name: 'Livros Ativos',
      value: activeBooks.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      link: '/admin/livros'
    },
    {
      name: 'Pedidos Pendentes',
      value: pendingOrders.length,
      icon: Package,
      color: 'bg-orange-500',
      link: '/admin/pedidos'
    },
    {
      name: 'Faturamento Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/admin/pedidos'
    },
    {
      name: 'Estoque Baixo',
      value: lowStockBooks.length,
      icon: AlertCircle,
      color: 'bg-red-500',
      link: '/admin/livros'
    }
  ];

  const recentOrders = orders.slice(-5).reverse();
  
  // Calcular livros mais vendidos
  const bookSales = new Map<string, number>();
  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        const currentSales = bookSales.get(item.book.id) || 0;
        bookSales.set(item.book.id, currentSales + item.quantity);
      });
    }
  });

  const bestSellingBooks = books
    .filter(b => b.active)
    .map(book => ({
      ...book,
      totalSales: bookSales.get(book.id) || 0
    }))
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-slate-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Visão geral da sua livraria
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link}>
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="size-6 text-white" />
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                  {stat.name}
                </p>
                <p className="text-2xl text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="size-5 text-orange-600 dark:text-orange-400" />
            <h2 className="text-xl text-slate-900 dark:text-white">Alertas</h2>
          </div>

          <div className="space-y-4">
            {pausedBooks.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>{pausedBooks.length}</strong> {pausedBooks.length === 1 ? 'livro pausado' : 'livros pausados'}
                </p>
              </div>
            )}

            {lowStockBooks.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-300 mb-2">
                  <strong>{lowStockBooks.length}</strong> {lowStockBooks.length === 1 ? 'livro com estoque baixo' : 'livros com estoque baixo'}:
                </p>
                <ul className="text-xs text-orange-700 dark:text-orange-400 space-y-1">
                  {lowStockBooks.slice(0, 3).map(book => (
                    <li key={book.id}>
                      {book.title} - {book.stock} unidades
                    </li>
                  ))}
                  {lowStockBooks.length > 3 && (
                    <li className="text-orange-600 dark:text-orange-500">
                      +{lowStockBooks.length - 3} outros
                    </li>
                  )}
                </ul>
              </div>
            )}

            {outOfStockBooks.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-300 mb-2">
                  <strong>{outOfStockBooks.length}</strong> {outOfStockBooks.length === 1 ? 'livro esgotado' : 'livros esgotados'}:
                </p>
                <ul className="text-xs text-red-700 dark:text-red-400 space-y-1">
                  {outOfStockBooks.slice(0, 3).map(book => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                  {outOfStockBooks.length > 3 && (
                    <li className="text-red-600 dark:text-red-500">
                      +{outOfStockBooks.length - 3} outros
                    </li>
                  )}
                </ul>
              </div>
            )}

            {pendingOrders.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>{pendingOrders.length}</strong> {pendingOrders.length === 1 ? 'pedido aguardando' : 'pedidos aguardando'} confirmação
                </p>
              </div>
            )}

            {pausedBooks.length === 0 && lowStockBooks.length === 0 && outOfStockBooks.length === 0 && pendingOrders.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm">Nenhum alerta no momento</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-slate-900 dark:text-white">Pedidos Recentes</h2>
            <Link to="/admin/pedidos" className="text-sm text-[#1e3a5f] dark:text-blue-400 hover:underline">
              Ver todos
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm text-slate-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-900 dark:text-white">
                        R$ {order.total.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        order.status === 'pending' ? 'text-orange-600 dark:text-orange-400' :
                        order.status === 'confirmed' ? 'text-blue-600 dark:text-blue-400' :
                        order.status === 'shipped' ? 'text-purple-600 dark:text-purple-400' :
                        order.status === 'delivered' ? 'text-green-600 dark:text-green-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {order.status === 'pending' ? 'Pendente' :
                         order.status === 'confirmed' ? 'Confirmado' :
                         order.status === 'shipped' ? 'Enviado' :
                         order.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')} às{' '}
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Package className="size-12 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">Nenhum pedido ainda</p>
            </div>
          )}
        </div>
      </div>

      {/* Best Selling Books */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="size-5 text-[#1e3a5f] dark:text-blue-400" />
          <h2 className="text-xl text-slate-900 dark:text-white">Livros Mais Vendidos</h2>
        </div>

        {bestSellingBooks.length > 0 && bestSellingBooks.some(b => b.totalSales > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {bestSellingBooks.filter(b => b.totalSales > 0).map(book => (
              <div key={book.id} className="text-center">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg aspect-[3/4] mb-2" />
                <p className="text-sm text-slate-900 dark:text-white mb-1 line-clamp-2">
                  {book.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  📦 {book.totalSales} {book.totalSales === 1 ? 'venda' : 'vendas'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            <p className="text-sm">Nenhuma venda registrada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}