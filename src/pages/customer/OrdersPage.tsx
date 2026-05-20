import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Package className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
        Você ainda não possui pedidos.
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        Quando você concluir uma compra, seus pedidos aparecerão aqui.
      </p>
      <Link
        to="/"
        className="inline-block bg-linear-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all"
      >
        Ir às Compras
      </Link>
    </div>
  );
}
