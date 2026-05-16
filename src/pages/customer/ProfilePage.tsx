import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <User className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
          Faça login para acessar seu perfil
        </h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-slate-900 dark:text-white mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
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
                  disabled={!isEditing}
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

              <div className="pt-4">
                <Button
                  disabled
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  Salvar Alterações
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Esta funcionalidade estará disponível em breve
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 dark:border-slate-700 mt-6">
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

              <Button
                disabled
                variant="outline"
                className="dark:border-slate-600"
              >
                Atualizar Senha
              </Button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Esta funcionalidade estará disponível em breve
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div className="space-y-6">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Resumo da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full">
                  <User className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Nome</p>
                  <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full">
                  <Mail className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                  <p className="text-slate-900 dark:text-white font-medium text-sm break-all">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full">
                  <Shield className="size-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tipo de Conta</p>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {user.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
