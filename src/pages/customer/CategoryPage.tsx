import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import BookCard from '../../components/shared/BookCard';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Slider } from '../../components/ui/slider';
import { Label } from '../../components/ui/label';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { books } = useBooks();
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);

  const categoryBooks = books.filter(
    book => book.category === category && book.active
  );

  // Get unique authors
  const authors = [...new Set(categoryBooks.map(book => book.author))];

  // Apply filters
  let filteredBooks = categoryBooks.filter(book => {
    const priceMatch = book.price >= priceRange[0] && book.price <= priceRange[1];
    const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(book.author);
    return priceMatch && authorMatch;
  });

  // Sort books
  switch (sortBy) {
    case 'price-asc':
      filteredBooks.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredBooks.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  const toggleAuthor = (author: string) => {
    setSelectedAuthors(prev =>
      prev.includes(author)
        ? prev.filter(a => a !== author)
        : [...prev, author]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 200]);
    setSelectedAuthors([]);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-slate-900 dark:text-white mb-4 block">
          Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={200}
          step={10}
          className="mb-4"
        />
      </div>

      {/* Authors */}
      {authors.length > 0 && (
        <div>
          <Label className="text-slate-900 dark:text-white mb-3 block">Autores</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {authors.map(author => (
              <label
                key={author}
                className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={selectedAuthors.includes(author)}
                  onChange={() => toggleAuthor(author)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                {author}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Limpar Filtros
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button & Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-purple-600 hover:text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>

        <h1 className="text-3xl md:text-4xl text-slate-900 dark:text-white mb-2">
          {category}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'livro encontrado' : 'livros encontrados'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="size-5 text-[#1e3a5f] dark:text-blue-400" />
              <h2 className="text-slate-900 dark:text-white">Filtros</h2>
            </div>
            <FiltersContent />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <SlidersHorizontal className="size-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] dark:bg-slate-800">
                <SheetHeader>
                  <SheetTitle className="dark:text-white">Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:inline">
                Ordenar por:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] dark:bg-slate-800 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="price-asc">Menor Preço</SelectItem>
                  <SelectItem value="price-desc">Maior Preço</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400">
                Nenhum livro encontrado com esses filtros.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
