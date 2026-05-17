import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Book } from '../../contexts/BooksContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(book.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(book);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(book.id);
  };

  return (
    <Link to={`/livro/${book.id}`} className="group">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-700">
          <ImageWithFallback
            src={book.images[0]}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <Heart
              className={`size-5 ${
                favorite
                  ? 'fill-red-500 text-red-500'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            />
          </button>

          {/* Stock Badge */}
          {book.stock < 5 && book.stock > 0 && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              Últimas unidades
            </Badge>
          )}
          {book.stock === 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              Esgotado
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{book.category}</p>
            <h3 className="text-slate-900 dark:text-white mb-1 line-clamp-2 min-h-[2.5rem]">
              {book.title}
            </h3>
            {(book.salesCount || book.rating) && (
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                {typeof book.rating === 'number' && (
                  <span className="inline-flex items-center gap-1 text-amber-500 dark:text-amber-400 font-medium">
                    <Star className="size-3.5 fill-current" />
                    {book.rating.toFixed(1)}
                  </span>
                )}
                {typeof book.salesCount === 'number' && book.salesCount > 0 && (
                  <span className="text-slate-500 dark:text-slate-400">
                    +{book.salesCount} vendidos
                  </span>
                )}
              </div>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{book.author}</p>
          </div>

          {/* Price and Actions */}
          <div className="mt-auto">
            <p className="text-2xl text-[#1e3a5f] dark:text-blue-400 mb-3">
              R$ {book.price.toFixed(2)}
            </p>
            
            <Button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
            >
              <ShoppingCart className="size-4 mr-2" />
              {book.stock === 0 ? 'Indisponível' : 'Adicionar'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}