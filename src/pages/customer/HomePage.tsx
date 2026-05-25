import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import BookCard from '../../components/shared/BookCard';
import { Button } from '../../components/ui/button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function HomePage() {
  const { books } = useBooks();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  useEffect(() => {
    const viewed = localStorage.getItem('recentlyViewed');
    if (viewed) {
      setRecentlyViewed(JSON.parse(viewed));
    }
  }, []);

  const activeBooks = books.filter(book => book.active);
  
  const filteredBooks = searchQuery
    ? activeBooks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeBooks;

  const featuredBooks = filteredBooks.slice(0, 4);
  const recentBooks = filteredBooks
    .sort((a, b) => (b.year || 0) - (a.year || 0))
    .slice(0, 6);

  const recentlyViewedBooks = recentlyViewed
    .map(id => books.find(book => book.id === id))
    .filter(Boolean)
    .slice(0, 4);

  const categories = [
    'Romance',
    'Suspense',
    'Evangélico',
    'Autoajuda',
    'Ficção Científica',
    'Fantasia',
  ];

  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'Romance':
        return '1524578271613-d550eacf6090';
      case 'Suspense':
        return '1512820790803-83ca734da794';
      case 'Evangélico':
        return '1519791883288-dc8bd696e667';
      case 'Autoajuda':
        return '1544947950-fa07a98d237f';
      case 'Ficção Científica':
        return '1763198216782-b534fea3dcf1';
      case 'Fantasia':
        return '1704468631975-39c14bfb39fe';
      default:
        return '1524578271613-d550eacf6090'; // Default to Romance
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      {!searchQuery && (
        <section className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-800 dark:to-pink-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl mb-6 font-bold drop-shadow-lg">
                Bem-vindo à Livraria Gilede Vieira
              </h1>
              <p className="text-xl mb-8 text-white drop-shadow-md">
                Encontre os melhores livros para você e sua família. 
                Qualidade, variedade e atendimento personalizado.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/categoria/Romance">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all">
                    Ver Romance
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/categoria/Evangélico">
                  <Button size="lg" className="bg-white/10 text-white border-2 border-white hover:bg-white hover:text-purple-600 font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl transition-all">
                    Livros Evangélicos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      {searchQuery && (
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-2xl text-slate-900 dark:text-white mb-2">
            Resultados para "{searchQuery}"
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {filteredBooks.length} {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                Nenhum livro encontrado. Tente outra busca.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Categories */}
      {!searchQuery && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl text-slate-900 dark:text-white mb-8">
            Explore por Categoria
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/categoria/${cat}`}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
              >
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-${getCategoryImage(cat)}?w=400&h=400&fit=crop`}
                  alt={cat}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-4">
                  <span className="text-white font-bold text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {cat}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Books */}
      {!searchQuery && featuredBooks.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-800 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="size-6 text-[#1e3a5f] dark:text-blue-400" />
              <h2 className="text-3xl text-slate-900 dark:text-white">
                Destaques
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Books */}
      {!searchQuery && recentBooks.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl text-slate-900 dark:text-white mb-8">
            Lançamentos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {recentBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {!searchQuery && recentlyViewedBooks.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl text-slate-900 dark:text-white mb-8">
            Vistos Recentemente
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewedBooks.map((book, index) => (
              book ? <BookCard key={book?.id ?? `recent-${index}`} book={book} /> : null
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {!searchQuery && (
        <section className="bg-slate-100 dark:bg-slate-800 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mercado Livre */}
              <div className="bg-white dark:bg-slate-700 rounded-lg p-8 shadow-lg text-center">
                <div className="bg-yellow-400 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.25 18.75L9.75 14.25L14.25 9.75L15.66 11.16L13.08 13.75H22.5V15.75H13.08L15.66 18.34L14.25 18.75ZM12 2.25C17.66 2.25 22.25 6.84 22.25 12.5C22.25 18.16 17.66 22.75 12 22.75C6.34 22.75 1.75 18.16 1.75 12.5C1.75 6.84 6.34 2.25 12 2.25Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl text-slate-900 dark:text-white mb-4">
                  Nossa Loja no Mercado Livre
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Acesse nossa loja oficial no Mercado Livre e aproveite todas as vantagens da plataforma!
                </p>
                <Button
                  size="lg"
                  className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
                  onClick={() => {
                    window.open('https://lista.mercadolivre.com.br/_CustId_532947791', '_blank');
                  }}
                >
                  Visitar Loja
                </Button>
              </div>

              {/* Ebooks - Biblioteca da Gilede */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8 shadow-lg text-center border border-slate-200 dark:border-slate-700">
                <div className="bg-amber-500/20 backdrop-blur w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-amber-600 dark:border-amber-500">
                  <svg className="w-10 h-10 text-amber-700 dark:text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5M21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl text-slate-900 dark:text-white mb-4">
                  Ebooks Gilede
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Descubra nossa biblioteca digital com ebooks exclusivos! Leitura instantânea e acesso ilimitado.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 dark:from-amber-700 dark:to-yellow-700 dark:hover:from-amber-800 dark:hover:to-yellow-800 text-white font-semibold shadow-lg"
                  onClick={() => {
                    window.open('https://hotmart.com/pt-br/club/biblioteca-da-gilede', '_blank');
                  }}
                >
                  Acessar Ebooks
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp CTA */}
      {!searchQuery && (
        <section className="bg-[#f5f5dc] dark:bg-slate-700 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl text-slate-900 dark:text-white mb-4">
              Não encontrou o que procura?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Entre em contato conosco pelo WhatsApp e teremos prazer em ajudá-lo a encontrar o livro perfeito!
            </p>
            <Button
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white"
              onClick={() => {
                const url = 'https://wa.me/5511985428782?text=Olá! Gostaria de mais informações.';
                window.open(url, '_blank');
              }}
            >
              Falar no WhatsApp
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
