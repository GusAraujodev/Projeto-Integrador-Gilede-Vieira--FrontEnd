import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, LogOut, Crown, Package, ArrowRight, Mail, Lock } from 'lucide-react';
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

  const savedAccounts = [
    {
      name: 'Giovani Vieira',
      role: 'Cliente',
      email: 'giovani.vieira@email.com',
      password: 'cliente123',
      icon: User,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Gilede Vieira',
      role: 'Admin',
      email: 'livrariagiledevieira@gmail.com',
      password: 'admin123',
      icon: Shield,
      color: 'from-purple-600 to-pink-500'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        setOpen(false);
        if (email === 'livrariagiledevieira@gmail.com') {
          navigate('/admin');
        }
      } else {
        setError('Email ou senha incorretos');
      }
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account: typeof savedAccounts[0]) => {
    setLoading(true);
    setError('');
    
    try {
      // Primeiro faz logout para limpar o estado
      logout();
      
      // Aguarda um pouco para garantir que o state foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Faz login com a nova conta
      const success = await login(account.email, account.password);
      if (success) {
        setOpen(false);
        
        // Aguarda para garantir que o login foi processado
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Navega para a área apropriada
        if (account.role === 'Admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
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
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border-2 border-purple-300 dark:border-purple-700">
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                size="lg"
              >
                <Package className="size-5 mr-2" />
                Meus Pedidos
              </Button>
            )}

            {/* Trocar Conta */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Trocar para outra conta:</p>
              <div className="space-y-2">
                {savedAccounts
                  .filter(acc => acc.email !== user.email)
                  .map((account) => {
                    const Icon = account.icon;
                    return (
                      <button
                        key={account.email}
                        onClick={() => handleQuickLogin(account)}
                        disabled={loading}
                        className="w-full p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`bg-gradient-to-r ${account.color} p-2 rounded-full`}>
                            <Icon className="size-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-900 dark:text-white font-medium">{account.name}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{account.role}</p>
                          </div>
                          <ArrowRight className="size-5 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Outras opções */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  navigate('/login');
                }}
              >
                <Mail className="size-4 mr-2" />
                Adicionar Nova Conta
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-slate-600 dark:text-slate-400"
                onClick={() => {
                  setOpen(false);
                  navigate('/esqueci-senha');
                }}
              >
                <Lock className="size-4 mr-2" />
                Esqueci a Senha
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate('/login');
                }}
              >
                <LogOut className="size-4 mr-2" />
                Sair de Todas as Contas
              </Button>
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
            Entre com sua conta ou escolha uma conta salva
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Saved Accounts */}
          <div>
            <h3 className="text-sm text-slate-700 dark:text-slate-300 mb-3">Contas Salvas</h3>
            <div className="grid gap-3">
              {savedAccounts.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.email}
                    onClick={() => handleQuickLogin(account)}
                    disabled={loading}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700
                      hover:border-purple-500 dark:hover:border-purple-400 transition-all
                      disabled:opacity-50 disabled:cursor-not-allowed
                      bg-gradient-to-r ${account.color} bg-opacity-5 hover:bg-opacity-10
                    `}
                  >
                    <div className={`flex items-center justify-center size-12 rounded-full bg-gradient-to-r ${account.color} text-white`}>
                      <Icon className="size-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-slate-900 dark:text-white">{account.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{account.role}</p>
                    </div>
                    <ArrowRight className="size-5 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>

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

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
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