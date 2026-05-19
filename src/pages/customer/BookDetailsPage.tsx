import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, MessageCircle, Plus, Minus, Package, ArrowLeft } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import BookCard from '../../components/shared/BookCard';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, getBookById } = useBooks();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const book = getBookById(id!);

  useEffect(() => {
    if (book) {
      // Add to recently viewed
      const viewed = localStorage.getItem('recentlyViewed');
      const viewedList: string[] = viewed ? JSON.parse(viewed) : [];
      const updated = [book.id, ...viewedList.filter(vid => vid !== book.id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
    }
  }, [book]);

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-slate-900 dark:text-white mb-4">Livro não encontrado</h1>
        <Button onClick={() => navigate('/')}>Voltar para Home</Button>
      </div>
    );
  }

  const favorite = isFavorite(book.id);
  const relatedBooks = books
    .filter(b => b.category === book.category && b.id !== book.id && b.active)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(book, quantity);
    // You could show a toast notification here
  };

  const handleBuyNow = () => {
    addToCart(book, quantity);
    navigate('/carrinho');
  };

  const whatsappMessage = `Olá! Gostaria de saber mais sobre o livro \"${book.title}\" (${book.author})`;
  const whatsappUrl = `https://wa.me/5511985428782?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button & Breadcrumb */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>

        {/* Breadcrumb */}
        <nav className="text-sm text-slate-600 dark:text-slate-400">
          <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link>
          {' / '}
          <Link to={`/categoria/${book.category}`} className="hover:text-purple-600 dark:hover:text-purple-400">
            {book.category}
          </Link>
          {' / '}
          <span className="text-slate-900 dark:text-white">{book.title}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden mb-4 aspect-[3/4]">
            <ImageWithFallback
              src={book.images[selectedImage]}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          {book.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {book.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-[3/4] rounded overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-[#1e3a5f] dark:border-blue-400'
                      : 'border-transparent'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${book.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="mb-4">
            <Badge className="mb-2">{book.category}</Badge>
            {book.mlSynced && (
              <Badge variant="outline" className="ml-2">
                Sincronizado com ML
              </Badge>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-2">
            {book.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
            por {book.author}
          </p>

          <Separator className="my-6" />

          {/* Price */}
          <div className="mb-6">
            <p className="text-4xl text-[#1e3a5f] dark:text-blue-400">
              R$ {book.price.toFixed(2)}
            </p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="size-5 text-slate-600 dark:text-slate-400" />
            {book.stock > 0 ? (
              <span className="text-slate-600 dark:text-slate-400">
                {book.stock} em estoque
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">Esgotado</span>
            )}
          </div>

          {/* Quantity */}
          {book.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">
                Quantidade
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="px-4 text-slate-900 dark:text-white">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    disabled={quantity >= book.stock}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              onClick={handleBuyNow}
              disabled={book.stock === 0}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 dark:from-purple-700 dark:to-pink-600"
            >
              Comprar Agora
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              variant="outline"
              size="lg"
              className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400"
            >
              <ShoppingCart className="size-4 mr-2" />
              Adicionar ao Carrinho
            </Button>
            <Button
              onClick={() => toggleFavorite(book.id)}
              variant="outline"
              size="lg"
            >
              <Heart
                className={`size-5 ${
                  favorite ? 'fill-red-500 text-red-500' : ''
                }`}
              />
            </Button>
          </div>

          {/* WhatsApp */}
          <Button
            onClick={() => window.open(whatsappUrl, '_blank')}
            variant="outline"
            className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
          >
            <MessageCircle className="size-4 mr-2" />
            Tirar Dúvidas pelo WhatsApp
          </Button>

          <Separator className="my-6" />

          {/* Additional Info */}
          <div className="space-y-2 text-sm">
            {book.year && (
              <p className="text-slate-600 dark:text-slate-400">
                <strong>Ano:</strong> {book.year}
              </p>
            )}
            {book.isbn && (
              <p className="text-slate-600 dark:text-slate-400">
                <strong>ISBN:</strong> {book.isbn}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-16">
        <h2 className="text-2xl text-slate-900 dark:text-white mb-4">Descrição</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-400">{book.description}</p>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div>
          <h2 className="text-2xl text-slate-900 dark:text-white mb-6">
            Livros Relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBooks.map(relatedBook => (
              <BookCard key={relatedBook.id} book={relatedBook} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
