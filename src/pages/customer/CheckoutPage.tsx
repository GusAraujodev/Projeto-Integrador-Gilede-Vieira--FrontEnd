import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Lock } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, discount, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [isCepValid, setIsCepValid] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cep: '',
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
  // Adicione a condição && !isFinishing
  if (items.length === 0 && !isSubmitting && !isFinishing) {
    navigate('/carrinho');
  }
}, [items.length, navigate, isSubmitting, isFinishing]);

  // Don't render if cart is empty and not submitting
  if (items.length === 0 && !isSubmitting) {
    return null;
  }

  const clearAddressFields = () => {
    setFormData(prev => ({
      ...prev,
      street: '',
      neighborhood: '',
      city: '',
      state: '',
    }));
    setShippingCost(null);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cep') {
      const cepApenasNumeros = value.replace(/\D/g, '');
      const cepFinal = cepApenasNumeros.slice(0, 8);

      setFormData(prev => ({ ...prev, cep: cepFinal }));
      setErrors(prev => ({ ...prev, cep: '' }));

      if (cepFinal.length === 8) {
        try {
          clearAddressFields();

          const response = await fetch(`https://viacep.com.br/ws/${cepFinal}/json/`);

          if (!response.ok) {
            clearAddressFields();
            return;
          }

          const data = await response.json() as {
            erro?: boolean;
            logradouro?: string;
            bairro?: string;
            localidade?: string;
            uf?: string;
          };

          if (data.erro) {
            clearAddressFields();
            setIsCepValid(false);
            return;
          }

          setFormData(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || '',
          }));
          setShippingCost(15.00);
          setIsCepValid(true);
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
          clearAddressFields();
        }

        return;
      }

      clearAddressFields();
      return;
    }

    setFormData(prev => {
      switch (name) {
        case 'phone':
          return { ...prev, phone: value.replace(/\D/g, '').slice(0, 11) };
        case 'number':
          return { ...prev, number: value.replace(/\D/g, '').slice(0, 6) };
        case 'state':
          return { ...prev, state: value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() };
        default:
          return { ...prev, [name]: value };
      }
    });

    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const formatPhoneValue = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';

const cepDigits = formData.cep.replace(/\D/g, '');
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (cepDigits.length !== 8) {
      newErrors.cep = 'CEP inválido — informe os 8 dígitos';
    }
    if (!formData.street.trim()) newErrors.street = 'Rua é obrigatória';
    if (!formData.number.trim()) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória';
    if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!isCepValid) {
    setSubmitError('Por favor, informe um CEP válido.');
    return;
  }
  if (!validateForm()) return;

  setIsSubmitting(true);
  setSubmitError('');

  try {
    const token = localStorage.getItem('gilede_jwt');
    const savedUser = localStorage.getItem('gilede_user');
    const userId = user?.id || (savedUser ? JSON.parse(savedUser).id : null);

    // 1. Criar o pedido
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        userId,
        address: {
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zipCode: formData.cep,
        },
        items: items.map((item) => ({ bookId: item.book.id, quantity: item.quantity })),
        paymentMethod: formData.paymentMethod.toUpperCase(),
        shippingCost: shippingCost ?? 0,
      }),
    });

    if (!response.ok) throw new Error('Falha ao criar pedido');
    const orderData = await response.json() as { id: string };
    
    // 2. Tentar pagamento
    try {
      const paymentRes = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderData.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json() as { checkoutUrl?: string };
        if (paymentData.checkoutUrl) {
          clearCart(); // Limpa SÓ quando já temos o redirecionamento garantido
          window.location.href = paymentData.checkoutUrl;
          return;
        }
      }
    } catch (err) {
      console.warn('Falha na integração com MP, seguindo para detalhes do pedido...');
    }

    // 3. Sucesso sem Mercado Pago ou falha no MP: vai para a página do pedido
    clearCart(); 
    navigate(`/pedido/${orderData.id}`);

  } catch (error) {
    console.error('Erro:', error);
    setSubmitError(error instanceof Error ? error.message : 'Erro ao finalizar pedido');
    setIsSubmitting(false); // Só volta a habilitar o botão se der erro
  }
};
  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const totalWithShipping = subtotal * (1 - discount) + (shippingCost ?? 0);

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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="phone"
                    value={formatPhoneValue(formData.phone)}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={15}
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
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    name="cep"
                    value={formData.cep.length > 5 ? formData.cep.replace(/^(\d{5})(\d{1,3})/, '$1-$2') : formData.cep}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={9}
                    placeholder="00000-000"
                    className={errors.cep ? 'border-red-500' : ''}
                  />
                  {errors.cep && (
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      {errors.cep}
                    </p>
                  )}
                </div>
                <div />
                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
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
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={6}
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
                    name="complement"
                    value={formData.complement}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
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
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
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
                    name="state"
                    value={formData.state.toUpperCase()}
                    onChange={handleChange}
                    placeholder="SP"
                    inputMode="text"
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
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value as 'pix' | 'credit' | 'debit' }))}
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
                  <span className={shippingCost !== null ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}>
                    {shippingCost !== null ? `R$ ${shippingCost.toFixed(2)}` : '--'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>R$ {totalWithShipping.toFixed(2)}</span>
                </div>
              </div>

              {submitError && (
                <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                  {submitError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
              >
                {isSubmitting ? 'Um momento...' : 'Confirmar Pedido'}
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
