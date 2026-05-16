import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
                      <Route path="/admin/*" element={<AdminRoutes />} />

                      <Route path="/*" element={<CustomerRoutes />} />

                      <Route path="/login" element={<LoginPage />} />

                      <Route path="*" element={<Navigate to="/" replace />} />
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