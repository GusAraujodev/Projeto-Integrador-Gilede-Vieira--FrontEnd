import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, LogOut, Crown, Package, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface AccountDialogProps {
  renderTrigger?: (onClick: () => void) => React.ReactNode;
}

export default function AccountDialog({ renderTrigger }: AccountDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resolveRouteByRole = () => {
    try {
      const savedUser = localStorage.getItem('gilede_user');

      if (!savedUser) {
        return '/';
      }

      const parsedUser = JSON.parse(savedUser) as { role?: string };
      return parsedUser.role?.toLowerCase() === 'admin' ? '/admin' : '/';
    } catch {
      return '/';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setOpen(false);
        navigate(resolveRouteByRole(), { replace: true });
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {renderTrigger ? (
          <DialogTrigger asChild>
            <div>{renderTrigger(() => setOpen(true))}</div>
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-slate-600 dark:text-slate-400">Olá,</span>
                <span className="text-sm text-slate-900 dark:text-white">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="dark:text-slate-300"
              >
                <User className="size-5" />
              </Button>
            </div>
          </DialogTrigger>
        )}
        <DialogContent className="sm:max-w-[450px] dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <User className="size-6 text-purple-600 dark:text-purple-400" />
              Minha Conta
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Gerencie suas informações pessoais e pedidos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Conta Atual */}
            <div className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-300 dark:border-purple-700">
              <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 font-semibold">CONTA ATUAL</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">{user.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {user.role === 'admin' ? '👑 Administrador' : '👤 Cliente'}
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Painel Admin */}
            {user.role === 'admin' && !location.pathname.startsWith('/admin') && (
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate('/admin');
                }}
                className="w-full bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                size="lg"
              >
                <Shield className="size-5 mr-2" />
                Abrir Painel de Controle
              </Button>
            )}

            {/* Botão Meus Pedidos - Para Clientes */}
            {user.role === 'customer' && (
              <Button
                onClick={() => {
                  setOpen(false);
                  navigate('/historico');
                }}
                className="w-full bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                size="lg"
              >
                <Package className="size-5 mr-2" />
                Meus Pedidos
              </Button>
            )}

            {/* Outras opções */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-left text-red-600 transition-colors hover:bg-red-500/10 hover:text-red-700 dark:border-red-400/10 dark:bg-red-400/10 dark:text-red-300 dark:hover:bg-red-400/15 dark:hover:text-red-200"
                onClick={() => {
                  logout();
                  setOpen(false);
                  window.location.href = '/';
                }}
              >
                <LogOut className="size-4 shrink-0" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
          <User className="size-5" />
          <span className="hidden sm:inline ml-1">Minha Conta</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] dark:bg-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <User className="size-6 text-purple-600 dark:text-purple-400" />
            Minha Conta
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Entre com sua conta para acessar sua área personalizada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
                Ou entre manualmente
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
