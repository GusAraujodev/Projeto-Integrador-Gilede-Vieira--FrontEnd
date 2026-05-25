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
  addBook: (book: BookPayload) => Promise<void>;
  updateBook: (id: string, book: Partial<BookPayload>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  toggleBookStatus: (id: string, currentStatus: boolean) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  getBooksByCategory: (category: string) => Book[];
  syncFromML: (mlProducts: MLProduct[]) => Promise<void>;
  reduceStock: (bookId: string, quantity: number) => Promise<void>;
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

const apiBase = import.meta.env.VITE_API_URL || 'https://livraria-backend-1m69.onrender.com';
const BOOKS_API_URL = `${apiBase}/books`;
const ADMIN_BOOKS_API_URL = `${apiBase}/admin/books`;

type BookPayload = {
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
  rating?: number;
  isbn?: string;
};

type BooksApiItem = BookPayload & {
  id: string;
  salesCount?: number;
  reviews?: Review[];
  pages?: number;
  publisher?: string;
  sales_count?: number;
  ml_id?: string;
  ml_synced?: boolean;
  is_active?: boolean;
  image_urls?: string[];
};

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const headers: HeadersInit = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('gilede_jwt');

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  const parseErrorMessage = async (response: Response, fallback: string) => {
    const text = await response.text().catch(() => '');

    if (!text) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(text) as { message?: string; error?: string };
      return parsed.message || parsed.error || text || fallback;
    } catch {
      return text || fallback;
    }
  };

  const normalizeBook = (book: BooksApiItem): Book => ({
    id: String(book.id),
    title: book.title,
    author: book.author,
    description: book.description,
    category: book.category,
    price: Number(book.price),
    stock: Number(book.stock),
    images: Array.isArray(book.images)
      ? book.images.filter((image): image is string => typeof image === 'string')
      : Array.isArray(book.image_urls)
        ? book.image_urls.filter((image): image is string => typeof image === 'string')
      : [],
    active: typeof book.active === 'boolean' ? book.active : Boolean(book.is_active),
    year: typeof book.year === 'number' ? book.year : undefined,
    mlId: typeof book.mlId === 'string' ? book.mlId : typeof book.ml_id === 'string' ? book.ml_id : undefined,
    mlSynced: typeof book.mlSynced === 'boolean' ? book.mlSynced : Boolean(book.ml_synced),
    salesCount: typeof book.salesCount === 'number' ? book.salesCount : typeof book.sales_count === 'number' ? book.sales_count : undefined,
    rating: typeof book.rating === 'number' ? book.rating : undefined,
    reviews: Array.isArray(book.reviews) ? book.reviews : [],
    isbn: typeof book.isbn === 'string' ? book.isbn : undefined,
  });

  const loadBooks = async ({
    signal,
    throwOnError = true,
  }: {
    signal?: AbortSignal;
    throwOnError?: boolean;
  } = {}) => {
    if (!signal) {
      setLoading(true);
    }

    try {
      const token = localStorage.getItem('gilede_jwt');
      const savedUser = localStorage.getItem('gilede_user');
      const role = savedUser ? JSON.parse(savedUser)?.role?.toUpperCase() : null;
      const isAdmin = role === 'ADMIN';

      if (isAdmin && !token) {
        setBooks([]);
        return [] as Book[];
      }

      const response = await fetch(isAdmin ? ADMIN_BOOKS_API_URL : BOOKS_API_URL, {
        signal,
        headers: isAdmin && token
          ? {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }
          : {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, 'Falha ao carregar livros'));
      }

      const data = (await response.json()) as BooksApiItem[];
      const normalizedBooks = Array.isArray(data) ? data.map(normalizeBook) : [];

      setBooks(normalizedBooks);
      return normalizedBooks;
    } catch (error) {
      if (signal?.aborted) {
        return [] as Book[];
      }

      if (throwOnError) {
        throw error instanceof Error ? error : new Error('Falha ao carregar livros');
      }

      console.error('Erro ao carregar livros da API.', error);
      setBooks([]);
      return [] as Book[];
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const requestJson = async (method: string, url: string, body?: unknown) => {
    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Falha ao salvar livro'));
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text().catch(() => '');

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadBooks({ signal: controller.signal, throwOnError: false });

    return () => {
      controller.abort();
    };
  }, []);

  const addBook = async (book: BookPayload) => {
    await requestJson('POST', BOOKS_API_URL, book);
    await loadBooks({ throwOnError: true });
  };

  const updateBook = async (id: string, updates: Partial<BookPayload>) => {
    await requestJson('PUT', `${BOOKS_API_URL}/${id}`, updates);
    await loadBooks({ throwOnError: true });
  };

  const deleteBook = async (id: string) => {
    await requestJson('DELETE', `${BOOKS_API_URL}/${id}`);
    await loadBooks({ throwOnError: true });
  };

  const toggleBookStatus = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('gilede_jwt');

    const response = await fetch(`${apiBase}/books/${id}/status`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active: !currentStatus }),
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, 'Falha ao atualizar status do livro'));
    }

    await loadBooks({ throwOnError: true });
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const getBooksByCategory = (category: string) => {
    return books.filter(book => book.category === category && book.active);
  };

  const syncFromML = async (mlProducts: MLProduct[]) => {
    if (mlProducts.length === 0) {
      return;
    }

    await Promise.all(
      mlProducts.map((product) =>
        requestJson('POST', BOOKS_API_URL, {
          title: product.title,
          author: product.attributes?.find((a) => a.name === 'Autor')?.value || 'Desconhecido',
          description: product.description,
          category: product.category,
          price: product.price,
          stock: product.available_quantity,
          images: product.pictures?.map((p) => p.url).filter((url): url is string => Boolean(url)) || [],
          active: true,
          mlId: product.id,
          mlSynced: true,
        })
      )
    );

    await loadBooks({ throwOnError: true });
  };

  const reduceStock = async (bookId: string, quantity: number) => {
    const currentBook = books.find((book) => book.id === bookId);

    if (!currentBook) {
      throw new Error('Livro não encontrado');
    }

    await requestJson('PATCH', `${BOOKS_API_URL}/${bookId}`, {
      stock: Math.max(0, currentBook.stock - quantity),
    });

    await loadBooks({ throwOnError: true });
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
