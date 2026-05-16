import { Heart } from 'lucide-react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBooks } from '../../contexts/BooksContext';
import BookCard from '../../components/shared/BookCard';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { books } = useBooks();

  const favoriteBooks = books.filter(book => favorites.includes(book.id));

  if (favoriteBooks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <Heart className="size-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl text-slate-900 dark:text-white mb-2">
            Nenhum favorito ainda
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Adicione livros aos favoritos para encontrá-los facilmente depois!
          </p>
          <Button onClick={() => navigate('/')} className="bg-[#1e3a5f] hover:bg-[#2d5082]">
            Explorar Livros
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="size-8 text-red-500" />
        <h1 className="text-3xl text-slate-900 dark:text-white">
          Meus Favoritos ({favoriteBooks.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favoriteBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
