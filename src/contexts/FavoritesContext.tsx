import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (bookId: string) => void;
  removeFromFavorites: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  toggleFavorite: (bookId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (bookId: string) => {
    setFavorites(prev => [...new Set([...prev, bookId])]);
  };

  const removeFromFavorites = (bookId: string) => {
    setFavorites(prev => prev.filter(id => id !== bookId));
  };

  const isFavorite = (bookId: string) => {
    return favorites.includes(bookId);
  };

  const toggleFavorite = (bookId: string) => {
    if (isFavorite(bookId)) {
      removeFromFavorites(bookId);
    } else {
      addToFavorites(bookId);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
