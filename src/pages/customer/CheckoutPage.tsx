import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Lock } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useAuth } from '../../contexts/AuthContext';
import { useBooks } from '../../contexts/BooksContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, discount, couponCode, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { reduceStock } = useBooks();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    paymentMethod: 'pix' as 'pix' | 'credit' | 'debit'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty (but not during submission)
  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate('/carrinho');
    }
  }, [items.length, navigate, isSubmitting]);

  // Don't render if cart is empty and not submitting
  if (items.length === 0 && !isSubmitting) {
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório';
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const orderId = createOrder({
      userId: user?.email, // Associate order with user
      items,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: {
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode
      },
      paymentMethod: formData.paymentMethod,
      total,
      discount,
      couponCode
    });

    console.log('Order created with ID:', orderId);

    // Reduce stock for each item in the cart
    items.forEach(item => {
      reduceStock(item.book.id, item.quantity);
    });

    clearCart();
    
    console.log('Navigating to:', `/pedido/${orderId}`);
    navigate(`/pedido/${orderId}`);
  };

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-slate-900 dark:text-white mb-8">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl text-slate-900 dark:text-white mb-6">
                Informações de Contato
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(11) 98542-8782"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl text-slate-900 dark:text-white mb-6">
                Endereço de Entrega
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    placeholder="00000-000"
                    className={errors.zipCode ? 'border-red-500' : ''}
                  />
                  {errors.zipCode && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.zipCode}
                    </p>
                  )}
                </div>
                <div />
                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleChange('street', e.target.value)}
                    className={errors.street ? 'border-red-500' : ''}
                  />
                  {errors.street && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.street}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => handleChange('number', e.target.value)}
                    className={errors.number ? 'border-red-500' : ''}
                  />
                  {errors.number && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.number}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) => handleChange('complement', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleChange('neighborhood', e.target.value)}
                    className={errors.neighborhood ? 'border-red-500' : ''}
                  />
                  {errors.neighborhood && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.neighborhood}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="SP"
                    maxLength={2}
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl text-slate-900 dark:text-white mb-6">
                Forma de Pagamento
              </h2>
              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value) => handleChange('paymentMethod', value)}
              >
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                    <RadioGroupItem value="pix" id="pix" />
                    <Smartphone className="size-5 text-[#1e3a5f] dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white">PIX</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Aprovação instantânea
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                    <RadioGroupItem value="credit" id="credit" />
                    <CreditCard className="size-5 text-[#1e3a5f] dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white">Cartão de Crédito</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Em até 12x sem juros
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700">
                    <RadioGroupItem value="debit" id="debit" />
                    <CreditCard className="size-5 text-[#1e3a5f] dark:text-blue-400" />
                    <div className="flex-1">
                      <p className="text-slate-900 dark:text-white">Cartão de Débito</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        À vista
                      </p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
              <h2 className="text-xl text-slate-900 dark:text-white mb-6">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 mb-6">
                {items.map(item => (
                  <div key={item.book.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      {item.quantity}x {item.book.title}
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      R$ {(item.book.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Desconto</span>
                    <span>-R$ {(subtotal * discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Frete</span>
                  <span className="text-green-600 dark:text-green-400">Grátis</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600">
                Confirmar Pedido
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Lock className="size-4" />
                <span>Pagamento seguro</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}