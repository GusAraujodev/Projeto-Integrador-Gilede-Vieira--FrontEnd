import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Package, Clock, MapPin, CreditCard, ArrowRight, Home, ShoppingBag } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import confetti from 'canvas-confetti';
import type { Order } from '../../contexts/OrdersContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById, fetchOrderById } = useOrders();
  const [order, setOrder] = useState(getOrderById(orderId || ''));

  console.log('OrderConfirmationPage - orderId:', orderId);
  console.log('OrderConfirmationPage - order found:', order);

  // Try to reload order if not found initially
  useEffect(() => {
    if (!order && orderId) {
      console.log('Trying to reload order...');
      const loadOrder = async () => {
        const local = getOrderById(orderId);

        if (local) {
          setOrder(local);
          return;
        }

        const fromApi = await fetchOrderById(orderId);

        if (fromApi) {
          setOrder(fromApi);
        }
      };

      void loadOrder();
    }
  }, [orderId, order, getOrderById, fetchOrderById]);

  useEffect(() => {
    // Celebration animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: ReturnType<typeof setInterval> = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#9333ea', '#ec4899', '#a855f7', '#f472b6']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#9333ea', '#ec4899', '#a855f7', '#f472b6']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
          Pedido não encontrado
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Não foi possível encontrar este pedido
        </p>
        <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-purple-600 to-pink-500">
          Voltar para Home
        </Button>
      </div>
    );
  }

  const getPaymentMethodLabel = (method: Order['paymentMethod']) => {
    const methods: Record<Order['paymentMethod'], string> = {
      pix: 'PIX',
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito'
    };
    return methods[method];
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center size-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
          <CheckCircle2 className="size-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-2">
          Pedido Confirmado! 🎉
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Recebemos seu pedido e estamos preparando tudo com carinho
        </p>
      </div>

      {/* Order Number */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Número do Pedido
              </p>
              <p className="text-2xl text-slate-900 dark:text-white font-mono">
                #{order.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Data do Pedido
              </p>
              <p className="text-slate-900 dark:text-white">
                {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
        <CardContent className="p-6">
          <h2 className="text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="size-5 text-purple-600 dark:text-purple-400" />
            Próximos Passos
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white">
                1
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white mb-1">
                  Confirmação por Email
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Enviamos um email de confirmação para <strong>{order.customerEmail}</strong> com todos os detalhes do seu pedido
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white">
                2
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white mb-1">
                  Preparação do Pedido
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Nossa equipe está separando os livros com muito cuidado para você
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 size-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white">
                3
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white mb-1">
                  Envio e Rastreamento
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Você receberá o código de rastreamento assim que o pedido for despachado
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Delivery Address */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin className="size-5 text-purple-600 dark:text-purple-400" />
              Endereço de Entrega
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p className="text-slate-900 dark:text-white">{order.customerName}</p>
              <p>{order.address.street}, {order.address.number}</p>
              {order.address.complement && <p>{order.address.complement}</p>}
              <p>{order.address.neighborhood}</p>
              <p>{order.address.city} - {order.address.state}</p>
              <p>CEP: {order.address.zipCode}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <CreditCard className="size-5 text-purple-600 dark:text-purple-400" />
              Forma de Pagamento
            </h3>
            <div className="text-sm">
              <p className="text-slate-900 dark:text-white mb-2">
                {getPaymentMethodLabel(order.paymentMethod)}
              </p>
              {order.paymentMethod === 'pix' && (
                <p className="text-slate-600 dark:text-slate-400">
                  ✅ Pagamento confirmado
                </p>
              )}
              {(order.paymentMethod === 'credit' || order.paymentMethod === 'debit') && (
                <p className="text-slate-600 dark:text-slate-400">
                  ✅ Pagamento processado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Package className="size-5 text-purple-600 dark:text-purple-400" />
            Itens do Pedido
          </h3>
          
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-slate-900 dark:text-white">
                    {item.book.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Quantidade: {item.quantity}
                  </p>
                </div>
                <p className="text-slate-900 dark:text-white">
                  R$ {(item.book.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>R$ {order.items.reduce((sum, item) => sum + item.book.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Desconto {order.couponCode && `(${order.couponCode})`}</span>
                <span>-R$ {(order.total / (1 - order.discount) * order.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Frete</span>
              <span className="text-green-600 dark:text-green-400">Grátis</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl text-slate-900 dark:text-white">
              <span>Total</span>
              <span>R$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="dark:border-slate-600"
        >
          <Link to="/">
            <Home className="mr-2 size-4" />
            Voltar para Home
          </Link>
        </Button>
        
        <Button
          asChild
          variant="outline"
          size="lg"
          className="dark:border-slate-600"
        >
          <Link to="/catalogo">
            <ShoppingBag className="mr-2 size-4" />
            Continuar Comprando
          </Link>
        </Button>

        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
        >
          <Link to="/historico">
            Acompanhar Pedido
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
        <p className="text-slate-900 dark:text-white mb-2">
          📦 Acompanhe o status do seu pedido em tempo real
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Acesse <Link to="/historico" className="text-purple-600 dark:text-purple-400 hover:underline">Histórico de Pedidos</Link> para ver todas as atualizações
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Dúvidas? Entre em contato pelo WhatsApp: <strong>(11) 98542-8782</strong>
        </p>
      </div>
    </div>
  );
}
