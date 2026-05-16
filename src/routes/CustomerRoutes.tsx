import { Route } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import HomePage from '../pages/customer/HomePage';
import CategoryPage from '../pages/customer/CategoryPage';
import BookDetailsPage from '../pages/customer/BookDetailsPage';
import CartPage from '../pages/customer/CartPage';
import CheckoutPage from '../pages/customer/CheckoutPage';
import OrderConfirmationPage from '../pages/customer/OrderConfirmationPage';
import OrderHistoryPage from '../pages/customer/OrderHistoryPage';
import AboutPage from '../pages/customer/AboutPage';
import FAQPage from '../pages/customer/FAQPage';
import FavoritesPage from '../pages/customer/FavoritesPage';

export default function CustomerRoutes() {
  return (
    <Route path="/" element={<CustomerLayout />}>
      <Route index element={<HomePage />} />
      <Route path="catalogo" element={<HomePage />} />
      <Route path="categoria/:category" element={<CategoryPage />} />
      <Route path="livro/:id" element={<BookDetailsPage />} />
      <Route path="carrinho" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="pedido/:orderId" element={<OrderConfirmationPage />} />
      <Route path="historico" element={<OrderHistoryPage />} />
      <Route path="sobre" element={<AboutPage />} />
      <Route path="faq" element={<FAQPage />} />
      <Route path="favoritos" element={<FavoritesPage />} />
    </Route>
  );
}