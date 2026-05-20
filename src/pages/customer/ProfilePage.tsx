import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CreditCard, Lock, Mail, MapPin, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'perfil' | 'endereco' | 'cartoes'>('perfil');

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
            <>
              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Informações Pessoais</CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Gerencie suas informações de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="dark:text-slate-200">Nome Completo</Label>
                    <Input
                      id="name"
                      value={user.name}
                      disabled
                      className="dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-slate-200">Email</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-slate-800 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Alterar Senha</CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Mantenha sua conta segura
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="dark:text-slate-200">Senha Atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      disabled
                      className="dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="dark:text-slate-200">Nova Senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      disabled
                      className="dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="dark:text-slate-200">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      disabled
                      className="dark:bg-slate-700 dark:border-slate-600"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'endereco' && (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="dark:text-white">Endereço de Entrega</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Seus endereços cadastrados aparecerão aqui.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400">
                  Nenhum endereço cadastrado no momento.
                </p>
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
