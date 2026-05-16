import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Book } from './BooksContext';
import { toast } from 'sonner@2.0.3';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  applyCoupon: (code: string) => boolean;
  discount: number;
  couponCode: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COUPONS: Record<string, number> = {
  'BEMVINDO10': 0.10,
  'LIVROS20': 0.20,
  'GILEDE15': 0.15
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (book: Book, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, book.stock);
        const addedQuantity = newQuantity - existing.quantity;
        
        if (addedQuantity > 0) {
          toast.success(`${addedQuantity}x "${book.title}" adicionado ao carrinho! 🛒`, {
            description: `Total: ${newQuantity} ${newQuantity === 1 ? 'unidade' : 'unidades'}`,
            duration: 3000,
          });
        } else {
          toast.warning(`Estoque máximo atingido para "${book.title}"`, {
            description: `Máximo: ${book.stock} unidades`,
            duration: 3000,
          });
        }
        
        return prev.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      toast.success(`"${book.title}" adicionado ao carrinho! 🛒`, {
        description: `Quantidade: ${quantity}`,
        duration: 3000,
      });
      
      return [...prev, { book, quantity: Math.min(quantity, book.stock) }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setItems(prev => prev.filter(item => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.book.id === bookId
          ? { ...item, quantity: Math.max(0, Math.min(quantity, item.book.stock)) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (COUPONS[upperCode]) {
      setCouponCode(upperCode);
      setDiscount(COUPONS[upperCode]);
      return true;
    }
    return false;
  };

  const subtotal = items.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const total = subtotal * (1 - discount);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      applyCoupon,
      discount,
      couponCode
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}