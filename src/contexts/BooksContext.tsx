import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  active: boolean;
  year?: number;
  mlId?: string;
  mlSynced?: boolean;
  salesCount?: number;
  rating?: number;
  reviews?: Review[];
  isbn?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface BooksContextType {
  books: Book[];
  loading: boolean;
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  toggleBookStatus: (id: string) => void;
  getBookById: (id: string) => Book | undefined;
  getBooksByCategory: (category: string) => Book[];
  syncFromML: (mlProducts: MLProduct[]) => void;
  reduceStock: (bookId: string, quantity: number) => void;
}

interface MLProductAttribute {
  name: string;
  value?: string;
}

interface MLProductPicture {
  url: string;
}

interface MLProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  available_quantity: number;
  attributes?: MLProductAttribute[];
  pictures?: MLProductPicture[];
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

const BOOKS_API_URL = `${import.meta.env.VITE_API_URL || 'https://livraria-backend-1m69.onrender.com'}/books`;

type BooksApiItem = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  active: boolean;
  year?: number;
  mlSynced?: boolean;
  salesCount?: number;
  rating?: number;
  isbn?: string;
  reviews?: Review[];
  mlId?: string;
};

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadBooks = async () => {
      setLoading(true);

      try {
        const response = await fetch(BOOKS_API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Falha ao carregar livros: ${response.status}`);
        }

        const data = (await response.json()) as BooksApiItem[];
        const normalizedBooks: Book[] = data.map((book) => ({
          id: String(book.id),
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
          price: Number(book.price),
          stock: Number(book.stock),
          images: Array.isArray(book.images)
            ? book.images.filter((image): image is string => typeof image === 'string')
            : [],
          active: Boolean(book.active),
          year: typeof book.year === 'number' ? book.year : undefined,
          mlSynced: Boolean(book.mlSynced),
          salesCount: typeof book.salesCount === 'number' ? book.salesCount : undefined,
          rating: typeof book.rating === 'number' ? book.rating : undefined,
          isbn: typeof book.isbn === 'string' ? book.isbn : undefined,
          reviews: Array.isArray(book.reviews) ? book.reviews : [],
          mlId: typeof book.mlId === 'string' ? book.mlId : undefined,
        }));

        if (isMounted) {
          setBooks(normalizedBooks);
        }
      } catch (error) {
        if (!controller.signal.aborted && isMounted) {
          console.error('Erro ao carregar livros da API.', error);
          setBooks([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString()
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const toggleBookStatus = (id: string) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, active: !book.active } : book
    ));
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const getBooksByCategory = (category: string) => {
    return books.filter(book => book.category === category && book.active);
  };

  const syncFromML = (mlProducts: MLProduct[]) => {
    // Simula importação do Mercado Livre
    const importedBooks: Book[] = mlProducts.map(product => ({
      id: Date.now().toString() + Math.random(),
      title: product.title,
      author: product.attributes?.find((a) => a.name === 'Autor')?.value || 'Desconhecido',
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.available_quantity,
      images: product.pictures?.map((p) => p.url) || [],
      active: true,
      mlId: product.id,
      mlSynced: true
    }));
    
    setBooks(prev => [...prev, ...importedBooks]);
  };

  const reduceStock = (bookId: string, quantity: number) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId 
        ? { ...book, stock: Math.max(0, book.stock - quantity) }
        : book
    ));
  };

  return (
    <BooksContext.Provider value={{
      books,
      loading,
      addBook,
      updateBook,
      deleteBook,
      toggleBookStatus,
      getBookById,
      getBooksByCategory,
      syncFromML,
      reduceStock
    }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) throw new Error('useBooks must be used within BooksProvider');
  return context;
}