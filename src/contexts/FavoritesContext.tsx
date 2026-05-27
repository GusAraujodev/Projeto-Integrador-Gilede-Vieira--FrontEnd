import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (bookId: string) => void;
  removeFromFavorites: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (bookId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
const API = (import.meta.env.VITE_API_URL as string) || '';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  const load = useCallback(async () => {
    if (!user?.id) {
      const saved = localStorage.getItem('favorites_guest');
      setFavorites(saved ? JSON.parse(saved) as string[] : []);
      return;
    }
    const token = localStorage.getItem('gilede_jwt');
    if (!token) return;
    try {
      const res = await fetch(`${API}/favorites/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const books = await res.json() as { id: string }[];
      setFavorites(books.map(b => b.id));
    } catch { /* silencia */ }
  }, [user?.id]);

  useEffect(() => { void load(); }, [load]);

  const addToFavorites = async (bookId: string) => {
    setFavorites(prev => [...new Set([...prev, bookId])]);
    if (!user?.id) {
      localStorage.setItem('favorites_guest', JSON.stringify([...new Set([...favorites, bookId])]) );
      return;
    }
    const token = localStorage.getItem('gilede_jwt');
    try {
      await fetch(`${API}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ userId: user.id, bookId }),
      });
    } catch { /* silencia */ }
  };

  const removeFromFavorites = async (bookId: string) => {
    setFavorites(prev => prev.filter(id => id !== bookId));
    if (!user?.id) {
      localStorage.setItem('favorites_guest', JSON.stringify(favorites.filter(id => id !== bookId)));
      return;
    }
    const token = localStorage.getItem('gilede_jwt');
    try {
      await fetch(`${API}/favorites/${user.id}/${bookId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch { /* silencia */ }
  };

  const isFavorite = (bookId: string) => favorites.includes(bookId);
  const toggleFavorite = (bookId: string) => {
    if (isFavorite(bookId)) void removeFromFavorites(bookId);
    else void addToFavorites(bookId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
