import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Separator } from '../../components/ui/separator';
import { useState } from 'react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, itemCount, applyCoupon, discount, couponCode } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  const handleApplyCoupon = () => {
    if (applyCoupon(couponInput)) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Cupom inválido');
    }
  };

  const handleCheckout = async () => {
    if (isCheckoutLoading) {
      return;
    }

    setIsCheckoutLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      navigate('/checkout');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl text-slate-900 dark:text-white mb-2">
            Seu carrinho está vazio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Adicione alguns livros ao seu carrinho para começar!
          </p>
          <Button onClick={() => navigate('/')} className="bg-[#1e3a5f] hover:bg-[#2d5082]">
            Continuar Comprando
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-slate-900 dark:text-white mb-8">
        Meu Carrinho ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.book.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 md:p-6"
            >
              <div className="flex gap-4">
                {/* Image */}
                <Link to={`/livro/${item.book.id}`} className="flex-shrink-0">
                  <div className="w-24 h-32 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                    <ImageWithFallback
                      src={item.book.images[0]}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link to={`/livro/${item.book.id}`}>
                    <h3 className="text-slate-900 dark:text-white mb-1 hover:text-[#1e3a5f] dark:hover:text-blue-400">
                      {item.book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {item.book.author}
                  </p>
                  <p className="text-xl text-[#1e3a5f] dark:text-blue-400 mb-4">
                    R$ {item.book.price.toFixed(2)}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className="px-4 text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                        disabled={item.quantity >= item.book.stock}
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.book.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Remover
                    </Button>

                    {/* Stock warning */}
                    {item.book.stock < 5 && (
                      <span className="text-sm text-orange-600 dark:text-orange-400">
                        Apenas {item.book.stock} em estoque
                      </span>
                    )}
                  </div>
                </div>

                {/* Subtotal */}
                <div className="hidden md:block text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    Subtotal
                  </p>
                  <p className="text-xl text-slate-900 dark:text-white">
                    R$ {(item.book.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Continuar Comprando
          </Button>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
            <h2 className="text-xl text-slate-900 dark:text-white mb-6">
              Resumo do Pedido
            </h2>

            {/* Coupon */}
            <div className="mb-6">
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Digite o cupom"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError('');
                  }}
                  disabled={!!couponCode}
                  className="dark:bg-slate-700"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponInput || !!couponCode}
                  variant="outline"
                >
                  <Tag className="size-4" />
                </Button>
              </div>
              {couponError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {couponError}
                </p>
              )}
              {couponCode && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Cupom "{couponCode}" aplicado!
                </p>
              )}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Desconto ({(discount * 100).toFixed(0)}%)</span>
                  <span>-R$ {(subtotal * discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Frete</span>
                  <span className="text-slate-500 dark:text-slate-400">--</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl text-slate-900 dark:text-white">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isCheckoutLoading}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
              size="lg"
            >
              <span className="relative z-10">{isCheckoutLoading ? 'Um momento...' : 'Finalizar Compra'}</span>
              {isCheckoutLoading && (
                <span className="checkout-fill absolute inset-0 bg-white/20" />
              )}
            </Button>

            {/* Payment Methods */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Aceitamos PIX, Cartão de Crédito e Débito
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
