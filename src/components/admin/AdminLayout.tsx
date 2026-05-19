import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Settings, Menu, X, User, RefreshCw, ChevronRight, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../contexts/OrdersContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import logo from 'figma:asset/e424140872cdd5e1723e7bee340cc7b39a0d7bcb.png';
import AccountDialog from '../shared/AccountDialog';
import { Button } from '../ui/button';
import { Toaster } from '../ui/sonner';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Livros', href: '/admin/livros', icon: BookOpen },
  { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
  { name: 'Sincronizar ML', href: '/admin/ml-sync', icon: RefreshCw },
  { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { pendingOrdersCount } = useOrders();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl text-slate-900 dark:text-white">Admin</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Moon className="size-6" /> : <Sun className="size-6" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6">
            <Link to="/" className="block mb-8">
              <div className="flex items-center gap-3">
                <img src={logo} alt="Livraria Gilede Vieira" className="h-12 w-auto" />
                <div>
                  <p className="text-purple-600 dark:text-purple-400 text-sm leading-tight">Livraria</p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm leading-tight">Gilede Vieira</p>
                </div>
              </div>
            </Link>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                const showBadge = item.name === 'Pedidos' && pendingOrdersCount > 0;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition-colors relative
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="size-5" />
                      <span>{item.name}</span>
                    </div>
                    {showBadge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                        {pendingOrdersCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200 dark:border-slate-700">
            <AccountDialog 
              renderTrigger={(onClick) => (
                <button
                  onClick={onClick}
                  className="w-full mb-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full">
                        <User className="size-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{user?.name}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                  </div>
                </button>
              )}
            />
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </Button>
              <Link to="/" className="block">
                <Button variant="outline" className="w-full text-sm" size="sm">
                  Ver Loja
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                size="sm"
              >
                <LogOut className="size-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
