import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from './CartContext';
import { useBooks } from './BooksContext';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
  fetchOrderById: (id: string) => Promise<any>;
  fetchUserOrders: (userId: string) => Promise<any[]>;
  fetchAllOrders: () => Promise<any[]>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load orders from localStorage on initialization
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const mapOrderItems = (items: unknown[] = []): CartItem[] => {
    return items.map((item) => {
      const orderItem = item as CartItem & { book?: CartItem['book']; quantity?: number };

      return {
        ...orderItem,
        book: orderItem.book,
        quantity: Number(orderItem.quantity ?? 0),
      };
    });
  };

  const mapApiOrder = (order: any): Order => {
    const paymentMethod = String(order?.paymentMethod || 'pix').toLowerCase();

    return {
      id: String(order?.id ?? order?.orderId ?? ''),
      userId: order?.userId ? String(order.userId) : undefined,
      items: mapOrderItems(Array.isArray(order?.items) ? order.items : []),
      customerName: String(order?.customerName ?? ''),
      customerEmail: String(order?.customerEmail ?? ''),
      customerPhone: String(order?.customerPhone ?? ''),
      address: {
        street: String(order?.address?.street ?? ''),
        number: String(order?.address?.number ?? ''),
        complement: typeof order?.address?.complement === 'string' ? order.address.complement : undefined,
        neighborhood: String(order?.address?.neighborhood ?? ''),
        city: String(order?.address?.city ?? ''),
        state: String(order?.address?.state ?? ''),
        zipCode: String(order?.address?.zipCode ?? ''),
      },
      paymentMethod: paymentMethod === 'credit'
        ? 'credit'
        : paymentMethod === 'debit'
          ? 'debit'
          : 'pix',
      total: Number(order?.total ?? 0),
      discount: Number(order?.discount ?? 0),
      couponCode: typeof order?.couponCode === 'string' ? order.couponCode : null,
      status: String(order?.status ?? 'pending').toLowerCase() as Order['status'],
      createdAt: String(order?.createdAt ?? new Date().toISOString()),
      updatedAt: typeof order?.updatedAt === 'string' ? order.updatedAt : undefined,
    };
  };

  const getAuthHeaders = () => ({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('gilede_jwt')}`,
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

  const fetchOrderById = async (id: string) => {
    const response = await fetch(`${apiBase}/orders/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar pedido');
    }

    const data = await response.json();
    const mappedOrder = mapApiOrder(data);

    setOrders(prev => {
      const alreadyExists = prev.some(order => order.id === mappedOrder.id);
      return alreadyExists
        ? prev.map(order => order.id === mappedOrder.id ? mappedOrder : order)
        : [mappedOrder, ...prev];
    });

    return mappedOrder;
  };

  const fetchUserOrders = async (userId: string) => {
    const response = await fetch(`${apiBase}/orders/user/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar pedidos do usuário');
    }

    const data = await response.json();
    const mappedOrders = Array.isArray(data) ? data.map(mapApiOrder) : [];

    setOrders(prev => {
      const merged = [...prev];

      mappedOrders.forEach((mappedOrder) => {
        const index = merged.findIndex(order => order.id === mappedOrder.id);

        if (index >= 0) {
          merged[index] = mappedOrder;
        } else {
          merged.unshift(mappedOrder);
        }
      });

      return merged;
    });

    return mappedOrders;
  };

  const fetchAllOrders = async () => {
    const response = await fetch(`${apiBase}/orders`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar pedidos');
    }

    const data = await response.json();
    const mappedOrders = Array.isArray(data) ? data.map(mapApiOrder) : [];

    setOrders(mappedOrders);
    return mappedOrders;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const response = await fetch(`${apiBase}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('gilede_jwt')}`,
      },
      body: JSON.stringify({ status: status.toUpperCase() }),
    });

    if (!response.ok) {
      throw new Error('Falha ao atualizar status do pedido');
    }

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
      pendingOrdersCount,
      fetchOrderById,
      fetchUserOrders,
      fetchAllOrders
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
