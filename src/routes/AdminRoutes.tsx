import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminBooks from '../pages/admin/AdminBooks';
import AdminBookForm from '../pages/admin/AdminBookForm';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminMLSync from '../pages/admin/AdminMLSync';
import AdminSettings from '../pages/admin/AdminSettings';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="livros" element={<AdminBooks />} />
        <Route path="livros/novo" element={<AdminBookForm />} />
        <Route path="livros/editar/:id" element={<AdminBookForm />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="ml-sync" element={<AdminMLSync />} />
        <Route path="configuracoes" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}