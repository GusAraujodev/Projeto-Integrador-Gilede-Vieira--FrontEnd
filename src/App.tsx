import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BooksProvider } from './contexts/BooksContext';
import { OrdersProvider } from './contexts/OrdersContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import LoginPage from './pages/LoginPage';
import CustomerRoutes from './routes/CustomerRoutes.tsx';
import AdminRoutes from './routes/AdminRoutes.tsx';

export default function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BooksProvider>
            <OrdersProvider>
              <NotificationsProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <Routes>
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/admin/*" element={<AdminRoutes />} />
                      <Route path="/*" element={<CustomerRoutes />} />
                    </Routes>
                  </FavoritesProvider>
                </CartProvider>
              </NotificationsProvider>
            </OrdersProvider>
          </BooksProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
