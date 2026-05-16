import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - em produção, isso seria uma chamada de API
    if (email === 'livrariagiledevieira@gmail.com' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Gilede Vieira',
        email: 'livrariagiledevieira@gmail.com',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    if (email === 'giovani.vieira@email.com' && password === 'cliente123') {
      const customerUser: User = {
        id: '2',
        name: 'Giovani Vieira',
        email: 'giovani.vieira@email.com',
        role: 'customer'
      };
      setUser(customerUser);
      localStorage.setItem('user', JSON.stringify(customerUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}