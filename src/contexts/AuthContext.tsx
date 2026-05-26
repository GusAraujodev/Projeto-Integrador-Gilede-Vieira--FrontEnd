import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('gilede_user');

      if (!saved) {
        return null;
      }

      const parsed = JSON.parse(saved) as Partial<User>;

      if (!parsed.id || !parsed.role) {
        localStorage.removeItem('gilede_user');
        localStorage.removeItem('gilede_jwt');
        return null;
      }

      return {
        id: String(parsed.id),
        name: typeof parsed.name === 'string' ? parsed.name : '',
        email: typeof parsed.email === 'string' ? parsed.email : '',
        role: String(parsed.role).toLowerCase() as 'admin' | 'customer',
      };
    } catch {
      localStorage.removeItem('gilede_user');
      localStorage.removeItem('gilede_jwt');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const syncFromStorage = () => {
      try {
        const saved = localStorage.getItem('gilede_user');

        if (!saved) {
          setUser(null);
          return;
        }

        const parsed = JSON.parse(saved) as Partial<User>;

        if (!parsed.id || !parsed.role) {
          return;
        }

        setUser({
          id: String(parsed.id),
          name: typeof parsed.name === 'string' ? parsed.name : '',
          email: typeof parsed.email === 'string' ? parsed.email : '',
          role: String(parsed.role).toLowerCase() as 'admin' | 'customer',
        });
      } catch {
        // ignora atualização inválida
      }
    };

    const validateSession = async () => {
      try {
        const token = localStorage.getItem('gilede_jwt');

        if (!token) {
          localStorage.removeItem('gilede_user');
          if (isMounted) {
            setUser(null);
          }
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Sessão inválida');
        }

        const data = await response.json();
        const nextUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: String(data.role).toLowerCase() as 'admin' | 'customer',
        };

        if (isMounted) {
          setUser(nextUser);
        }

        localStorage.setItem('gilede_user', JSON.stringify(nextUser));
      } catch (error) {
        console.error('Erro ao validar sessão:', error);
        localStorage.removeItem('gilede_user');
        localStorage.removeItem('gilede_jwt');

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    validateSession();

    const handleAuthUpdated = () => {
      syncFromStorage();
    };

    window.addEventListener('auth:updated', handleAuthUpdated);
    window.addEventListener('storage', handleAuthUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('auth:updated', handleAuthUpdated);
      window.removeEventListener('storage', handleAuthUpdated);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      const nextUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role.toLowerCase() // Garante compatibilidade caso o Java envie em uppercase ('ADMIN')
      };

      setUser(nextUser);
      localStorage.setItem('gilede_user', JSON.stringify(nextUser));
      localStorage.setItem('gilede_jwt', data.token);

      return true;
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      return false;
    }
  };

  const register = async (
    name: string, email: string, password: string, confirmPassword: string
  ): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        }
      );

      if (response.status === 409) {
        return { ok: false, error: 'Este email já está cadastrado.' };
      }
      if (response.status === 400) {
        const body = await response.json().catch(() => ({})) as { message?: string };
        return { ok: false, error: body.message ?? 'Dados inválidos.' };
      }
      if (!response.ok) {
        return { ok: false, error: 'Erro no servidor. Tente novamente.' };
      }

      // O backend retorna AuthDTOs.LoginResponse { token, user: { id, name, email, role } }
      const data = await response.json() as {
        token: string;
        user: { id: string; name: string; email: string; role: string };
      };

      const nextUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role.toLowerCase() as 'admin' | 'customer',
      };

      setUser(nextUser);
      localStorage.setItem('gilede_user', JSON.stringify(nextUser));
      localStorage.setItem('gilede_jwt', data.token);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: 'Sem conexão com o servidor.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gilede_user');
    localStorage.removeItem('gilede_jwt');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl px-8 py-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600 dark:border-purple-900 dark:border-t-purple-400" />
          <p className="text-lg text-slate-900 dark:text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      login, 
      register,
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
