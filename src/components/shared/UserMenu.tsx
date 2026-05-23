import { Link } from 'react-router-dom';
import { 
  Menu, 
  Package, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  Info, 
  Shield,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function UserMenu() {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-slate-800 dark:border-slate-700" align="end">
        <DropdownMenuLabel className="dark:text-slate-200">
          {user ? `Olá, ${user.name.split(' ')[0]}!` : 'Menu'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        
        {user ? (
          <>
            <DropdownMenuGroup>
              {user.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700">
                    <Shield className="mr-2 size-4" />
                    <span>Painel Admin</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem asChild>
                <Link to="/pedidos" className="flex items-center cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700">
                  <Package className="mr-2 size-4" />
                  <span>Meus Pedidos</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/configuracoes" className="flex items-center cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700">
                  <Settings className="mr-2 size-4" />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="dark:bg-slate-700" />
          </>
        ) : null}
        
        <DropdownMenuSeparator className="dark:bg-slate-700" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/faq" className="flex items-center cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700">
              <HelpCircle className="mr-2 size-4" />
              <span>Central de Ajuda</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/sobre" className="flex items-center cursor-pointer dark:text-slate-300 dark:hover:bg-slate-700">
              <Info className="mr-2 size-4" />
              <span>Sobre Nós</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
