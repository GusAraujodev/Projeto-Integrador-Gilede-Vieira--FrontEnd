import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Mail, MapPin, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

interface ProfilePayload {
  name?: string;
  email?: string;
  notificationEmail?: string;
  phone?: string;
  zipCode?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  address?: {
    zipCode?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'perfil' | 'endereco' | 'cartoes'>('perfil');
  const [editName, setEditName] = useState(user?.name ?? '');
  const [editNotificationEmail, setEditNotificationEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editZipCode, setEditZipCode] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editComplement, setEditComplement] = useState('');
  const [editNeighborhood, setEditNeighborhood] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');

  const [contactSaving, setContactSaving] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [contactErr, setContactErr] = useState('');

  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMsg, setAddressMsg] = useState('');
  const [addressErr, setAddressErr] = useState('');

  useEffect(() => {
    setEditName(user?.name ?? '');

    const loadProfile = async () => {
      const token = localStorage.getItem('gilede_jwt');

      if (!token) {
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          return;
        }

        const profile = await res.json() as ProfilePayload;
        const savedAddress = profile.address ?? {};

        setEditName(stripDigits(profile.name ?? user?.name ?? ''));
        setEditNotificationEmail(profile.notificationEmail ?? profile.email ?? user?.email ?? '');
        setEditPhone(formatPhoneValue(profile.phone ?? ''));
        setEditZipCode(formatCepValue(profile.zipCode ?? savedAddress.zipCode ?? ''));
        setEditStreet(profile.street ?? savedAddress.street ?? '');
        setEditNumber(profile.number ?? savedAddress.number ?? '');
        setEditComplement(profile.complement ?? savedAddress.complement ?? '');
        setEditNeighborhood(profile.neighborhood ?? savedAddress.neighborhood ?? '');
        setEditCity(profile.city ?? savedAddress.city ?? '');
        setEditState((profile.state ?? savedAddress.state ?? '').toUpperCase());
      } catch {
        // mantém os valores já carregados localmente
      }
    };

    void loadProfile();
  }, [user?.id]);

  const stripDigits = (value: string) => value.replace(/\d/g, '');

  const onlyDigits = (value: string) => value.replace(/\D/g, '');

  const formatPhoneValue = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);

    if (digits.length <= 2) {
      return digits;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCepValue = (value: string) => {
    const digits = onlyDigits(value).slice(0, 8);

    if (digits.length <= 5) {
      return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  };

  const syncStoredUser = (nextValues: ProfilePayload) => {
    const saved = localStorage.getItem('gilede_user');

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved) as Record<string, unknown>;
      localStorage.setItem('gilede_user', JSON.stringify({
        ...parsed,
        notificationEmail: nextValues.notificationEmail ?? parsed.notificationEmail,
        ...nextValues,
      }));
      window.dispatchEvent(new Event('auth:updated'));
    } catch {
      // ignora falha de persistência local
    }
  };

  const handleNameChange = (value: string) => {
    setEditName(stripDigits(value));
  };

  const handlePhoneChange = (value: string) => {
    setEditPhone(formatPhoneValue(value));
  };

  const handleCepChange = (value: string) => {
    setEditZipCode(formatCepValue(value));
  };

  const handleStateChange = (value: string) => {
    setEditState(value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase());
  };

  const handleCepBlur = async () => {
    const cep = onlyDigits(editZipCode);

    if (cep.length !== 8) {
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
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
        return;
      }

      setEditStreet(data.logradouro || '');
      setEditNeighborhood(data.bairro || '');
      setEditCity(data.localidade || '');
      setEditState((data.uf || '').toUpperCase());
    } catch {
      // sem fallback visual
    }
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSaving(true);
    setContactMsg('');
    setContactErr('');

    const token = localStorage.getItem('gilede_jwt');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: stripDigits(editName).trim(),
          notificationEmail: editNotificationEmail.trim(),
          phone: onlyDigits(editPhone),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar contato');
      }

      const updated = await response.json().catch(() => null) as ProfilePayload | null;

      syncStoredUser({
        name: updated?.name ?? stripDigits(editName).trim(),
        notificationEmail: updated?.notificationEmail ?? updated?.email ?? editNotificationEmail.trim(),
        phone: updated?.phone ?? onlyDigits(editPhone),
      });

      setContactMsg('Contato atualizado com sucesso!');
    } catch {
      setContactErr('Não foi possível salvar o contato. Tente novamente.');
    } finally {
      setContactSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaving(true);
    setAddressMsg('');
    setAddressErr('');

    const token = localStorage.getItem('gilede_jwt');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          zipCode: onlyDigits(editZipCode),
          street: editStreet.trim(),
          number: onlyDigits(editNumber),
          complement: editComplement.trim(),
          neighborhood: editNeighborhood.trim(),
          city: editCity.trim(),
          state: editState.trim().toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar endereço');
      }

      const updated = await response.json().catch(() => null) as ProfilePayload | null;

      syncStoredUser({
        zipCode: updated?.zipCode ?? onlyDigits(editZipCode),
        street: updated?.street ?? editStreet.trim(),
        number: updated?.number ?? onlyDigits(editNumber),
        complement: updated?.complement ?? editComplement.trim(),
        neighborhood: updated?.neighborhood ?? editNeighborhood.trim(),
        city: updated?.city ?? editCity.trim(),
        state: (updated?.state ?? editState).trim().toUpperCase(),
      });

      setAddressMsg('Endereço atualizado com sucesso!');
    } catch {
      setAddressErr('Não foi possível salvar o endereço. Tente novamente.');
    } finally {
      setAddressSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
          Faça login para acessar suas configurações
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-slate-900 dark:text-white mb-2">Configurações</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Gerencie seus dados pessoais e preferências da conta.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <Card className="dark:bg-slate-800 dark:border-slate-700 h-fit">
          <CardHeader>
            <CardTitle className="dark:text-white">Minha Conta</CardTitle>
            <CardDescription className="dark:text-slate-400">
              Navegue pelas seções da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveSection('perfil')}
              className={`w-full justify-start ${activeSection === 'perfil' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200' : 'dark:text-slate-300 dark:hover:bg-slate-700'}`}
            >
              <User className="mr-2 size-4" />
              Perfil
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveSection('endereco')}
              className={`w-full justify-start ${activeSection === 'endereco' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200' : 'dark:text-slate-300 dark:hover:bg-slate-700'}`}
            >
              <MapPin className="mr-2 size-4" />
              Endereço de Entrega
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveSection('cartoes')}
              className={`w-full justify-start ${activeSection === 'cartoes' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200' : 'dark:text-slate-300 dark:hover:bg-slate-700'}`}
            >
              <CreditCard className="mr-2 size-4" />
              Meus Cartões
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {activeSection === 'perfil' && (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Informações Pessoais</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Gerencie suas informações de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSaveContact} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="name" className="dark:text-slate-200">Nome Completo</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="rounded-lg dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="notification-email" className="dark:text-slate-200">E-mail</Label>
                      <Input
                        id="notification-email"
                        type="email"
                        value={editNotificationEmail}
                        onChange={(e) => setEditNotificationEmail(e.target.value)}
                        className="rounded-lg dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>

                    <div className="space-y-2 lg:col-span-1">
                      <Label htmlFor="phone" className="dark:text-slate-200">Telefone</Label>
                      <Input
                        id="phone"
                        value={editPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="rounded-lg dark:bg-slate-700 dark:border-slate-600"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>

                  {contactMsg && (
                    <p className="text-sm text-green-600 dark:text-green-400">{contactMsg}</p>
                  )}
                  {contactErr && (
                    <p className="text-sm text-red-600 dark:text-red-400">{contactErr}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={contactSaving}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    {contactSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeSection === 'endereco' && (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Endereço de Entrega</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Seus endereços cadastrados aparecerão aqui.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="space-y-2 col-span-12 lg:col-span-3">
                      <Label htmlFor="zipCode" className="dark:text-slate-200">CEP</Label>
                      <Input
                        id="zipCode"
                        value={editZipCode}
                        onChange={(e) => handleCepChange(e.target.value)}
                        onBlur={handleCepBlur}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                        maxLength={9}
                      />
                    </div>
                    <div className="space-y-2 col-span-12 lg:col-span-9">
                      <Label htmlFor="street" className="dark:text-slate-200">Rua</Label>
                      <Input
                        id="street"
                        value={editStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2 col-span-12 lg:col-span-3">
                      <Label htmlFor="number" className="dark:text-slate-200">Número</Label>
                      <Input
                        id="number"
                        value={editNumber}
                        onChange={(e) => setEditNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2 col-span-12 lg:col-span-4">
                      <Label htmlFor="complement" className="dark:text-slate-200">Complemento</Label>
                      <Input
                        id="complement"
                        value={editComplement}
                        onChange={(e) => setEditComplement(e.target.value)}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2 col-span-12 lg:col-span-5">
                      <Label htmlFor="neighborhood" className="dark:text-slate-200">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={editNeighborhood}
                        onChange={(e) => setEditNeighborhood(e.target.value)}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2 col-span-12 lg:col-span-9">
                      <Label htmlFor="city" className="dark:text-slate-200">Cidade</Label>
                      <Input
                        id="city"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                      />
                    </div>
                    <div className="space-y-2 col-span-12 lg:col-span-3">
                      <Label htmlFor="state" className="dark:text-slate-200">Estado</Label>
                      <Input
                        id="state"
                        value={editState}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full rounded-md dark:bg-slate-700 dark:border-slate-600"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {addressMsg && (
                    <p className="text-sm text-green-600 dark:text-green-400">{addressMsg}</p>
                  )}
                  {addressErr && (
                    <p className="text-sm text-red-600 dark:text-red-400">{addressErr}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={addressSaving}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    {addressSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeSection === 'cartoes' && (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Meus Cartões</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Cartões salvos para compras futuras.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Nenhum cartão salvo no momento.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
