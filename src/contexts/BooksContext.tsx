import { createContext, useContext, useState, ReactNode } from 'react';

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

// Mock data inicial
const initialBooks: Book[] = [
  {
    id: '1',
    title: 'O Poder do Hábito',
    author: 'Charles Duhigg',
    description: 'Por que fazemos o que fazemos na vida e nos negócios. Este livro revolucionário explica a ciência por trás dos hábitos e como podemos transformá-los para melhorar nossa vida.',
    category: 'Autoajuda',
    price: 42.90,
    stock: 15,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
    active: true,
    year: 2012,
    rating: 4.5,
    reviews: []
  },
  {
    id: '2',
    title: 'A Bíblia Sagrada',
    author: 'Vários Autores',
    description: 'Edição revista e atualizada. Tradução Almeida Revista e Corrigida. Inclui concordância e mapas bíblicos.',
    category: 'Evangélico',
    price: 55.00,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800'],
    active: true,
    year: 2020,
    rating: 5.0,
    reviews: []
  },
  {
    id: '3',
    title: 'A Garota no Trem',
    author: 'Paula Hawkins',
    description: 'Rachel pega o mesmo trem todas as manhãs. Ela conhece as casas, as ruas e até mesmo as pessoas que vê pela janela. Até que um dia ela vê algo chocante...',
    category: 'Suspense',
    price: 38.90,
    stock: 8,
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'],
    active: true,
    year: 2015,
    rating: 4.3,
    reviews: []
  },
  {
    id: '4',
    title: 'Orgulho e Preconceito',
    author: 'Jane Austen',
    description: 'A história de Elizabeth Bennet e Mr. Darcy é uma das mais adoradas da literatura mundial. Um clássico romance que atravessa gerações.',
    category: 'Romance',
    price: 34.90,
    stock: 12,
    images: ['https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800'],
    active: true,
    year: 1813,
    rating: 4.8,
    reviews: []
  },
  {
    id: '5',
    title: 'Matemática Básica - 6º Ano',
    author: 'José Roberto Silva',
    description: 'Material didático completo para o ensino fundamental. Inclui exercícios práticos e teoria bem explicada.',
    category: 'Didático',
    price: 89.90,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800'],
    active: true,
    year: 2023,
    rating: 4.2,
    reviews: []
  },
  {
    id: '6',
    title: 'Como Eu Era Antes de Você',
    author: 'Jojo Moyes',
    description: 'Lou Clark sabe muitas coisas. Ela sabe quantos passos existem entre a parada de ônibus e sua casa. Ela sabe que gosta de trabalhar em um café... Mas Lou não sabe que está prestes a perder o emprego.',
    category: 'Romance',
    price: 44.90,
    stock: 6,
    images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'],
    active: true,
    year: 2012,
    rating: 4.6,
    reviews: []
  }
];

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);

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