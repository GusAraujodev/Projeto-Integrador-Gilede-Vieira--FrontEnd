import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Power, Search, Filter } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function AdminBooks() {
  const { books, deleteBook, toggleBookStatus } = useBooks();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['Todos', ...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && book.active) ||
      (statusFilter === 'paused' && !book.active);
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl text-slate-900 dark:text-white mb-2">
            Gerenciar Livros
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {books.length} {books.length === 1 ? 'livro cadastrado' : 'livros cadastrados'}
          </p>
        </div>
        <Link to="/admin/livros/novo">
          <Button className="bg-[#1e3a5f] hover:bg-[#2d5082] dark:bg-blue-600 dark:hover:bg-blue-700">
            <Plus className="size-4 mr-2" />
            Adicionar Livro
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="paused">Pausados</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.filter(c => c !== 'Todos').map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Livro
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={book.images[0]}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-slate-900 dark:text-white line-clamp-1">
                            {book.title}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {book.author}
                          </p>
                          {book.mlSynced && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              ML Sync
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-900 dark:text-white">
                        R$ {book.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        book.stock === 0 ? 'text-red-600 dark:text-red-400' :
                        book.stock < 5 ? 'text-orange-600 dark:text-orange-400' :
                        'text-slate-900 dark:text-white'
                      }`}>
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={book.active ? 'bg-green-500' : 'bg-gray-500'}>
                        {book.active ? 'Ativo' : 'Pausado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookStatus(book.id)}
                          title={book.active ? 'Pausar' : 'Ativar'}
                        >
                          <Power className={`size-4 ${book.active ? 'text-orange-600' : 'text-green-600'}`} />
                        </Button>

                        <Link to={`/admin/livros/editar/${book.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="size-4 text-blue-600 dark:text-blue-400" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="size-4 text-red-600 dark:text-red-400" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Livro</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{book.title}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBook(book.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-slate-500 dark:text-slate-400">
                      Nenhum livro encontrado
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
