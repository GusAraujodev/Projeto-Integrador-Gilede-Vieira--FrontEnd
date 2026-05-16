import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Menu as MenuIcon, Moon, Sun } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import logo from 'figma:asset/e424140872cdd5e1723e7bee340cc7b39a0d7bcb.png';
import AccountDialog from '../shared/AccountDialog';
import UserMenu from '../shared/UserMenu';
import NotificationsBell from '../customer/NotificationsBell';

const categories = [
  'Autoajuda',
  'Romance',
  'Suspense',
  'Evangélico',
  'Didático',
  'Ficção',
  'Biografia'
];

export default function Header() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-800 dark:to-pink-700 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <p className="text-sm">Bem-vindo à Livraria Gilede Vieira</p>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                <img src={logo} alt="Livraria Gilede Vieira" className="h-10 sm:h-12 w-auto" />
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-lg leading-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold">Livraria</p>
              <p className="text-lg leading-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-semibold">Gilede Vieira</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Buscar livros, autores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 dark:bg-slate-700 dark:border-slate-600"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <Link to="/favoritos">
              <Button variant="ghost" size="sm" className="relative dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <Heart className="size-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/carrinho">
              <Button variant="ghost" size="sm" className="relative dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <ShoppingCart className="size-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            <UserMenu />

            <AccountDialog />

            <NotificationsBell />

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <MenuIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] dark:bg-slate-800">
                <nav className="flex flex-col gap-4 mt-8">
                  <form onSubmit={handleSearch} className="mb-4">
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="dark:bg-slate-700"
                    />
                  </form>
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/categoria/${cat}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400"
                    >
                      {cat}
                    </Link>
                  ))}
                  <hr className="dark:border-slate-700" />
                  <Link to="/sobre" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300">
                    Sobre
                  </Link>
                  <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="dark:text-slate-300">
                    FAQ
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-600">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 py-3">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  to={`/categoria/${cat}`}
                  className="text-sm text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}