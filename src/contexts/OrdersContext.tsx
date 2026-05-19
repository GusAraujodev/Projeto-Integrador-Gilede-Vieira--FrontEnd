import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from './CartContext';
import { useBooks } from './BooksContext';

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: 'pix' | 'credit' | 'debit';
  total: number;
  discount: number;
  couponCode: string | null;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

interface OrdersContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>) => string;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  pendingOrdersCount: number;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load orders from localStorage on initialization
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  // Sync orders state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    };

    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const createOrder = (orderData: Omit<Order, 'id' | 'status' | 'createdAt'>): string => {
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Update state
    setOrders(prev => [...prev, newOrder]);
    
    // Save to localStorage
    const savedOrders = localStorage.getItem('orders');
    const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
    allOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    return orderId;
  };

  const getOrderById = (id: string) => {
    console.log('getOrderById called with id:', id);
    
    // Check both in-memory orders and localStorage
    const savedOrders = localStorage.getItem('orders');
    console.log('localStorage orders:', savedOrders);
    
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      console.log('Parsed orders:', allOrders);
      const found = allOrders.find((order: Order) => order.id === id);
      console.log('Found in localStorage:', found);
      if (found) return found;
    }
    
    const foundInMemory = orders.find(order => order.id === id);
    console.log('Found in memory:', foundInMemory);
    return foundInMemory;
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    // Encontra o pedido antes de atualizar para criar notificação
    const order = getOrderById(id);
    
    setOrders(prev => prev.map(order =>
      order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
    ));
    
    // Atualiza no localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const allOrders = JSON.parse(savedOrders);
      const updated = allOrders.map((order: Order) =>
        order.id === id ? { ...order, status, updatedAt: new Date().toISOString() } : order
      );
      localStorage.setItem('orders', JSON.stringify(updated));
    }

    // Dispara evento customizado para notificar sobre mudança de status
    if (order) {
      window.dispatchEvent(new CustomEvent('orderStatusChanged', {
        detail: { orderId: id, status, userId: order.userId || order.customerEmail }
      }));
    }
  };

  const pendingOrdersCount = orders.filter(order => order.status === 'pending').length;

  return (
    <OrdersContext.Provider value={{
      orders,
      createOrder,
      getOrderById,
      getOrdersByUser,
      updateOrderStatus,
      pendingOrdersCount
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within OrdersProvider');
  return context;
}
