import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  images: string[];
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';

  useEffect(() => {
    void loadBooks(search);
  }, [search]);

  const loadBooks = async (searchQuery: string) => {
    // CACHE_KEY = "books_all" ou "books_search_harry"
    const cacheKey = searchQuery ? `books_search_${searchQuery}` : 'books_all';

    // Tenta pegar do SessionStorage (guarda enquanto aba está aberta)
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      // ✅ TEM CACHE → Mostra INSTANTANEAMENTE
      console.log(`📦 Carregado do cache: ${cacheKey}`);
      setBooks(JSON.parse(cached));
      return; // Pula requisição ao servidor
    }

    // ❌ SEM CACHE → Busca do servidor
    console.log(`🌐 Buscando do servidor: ${cacheKey}`);
    setLoading(true);
    setError('');

    try {
      const url = searchQuery 
        ? `/api/books?search=${encodeURIComponent(searchQuery)}`
        : '/api/books';

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data: Book[] = await response.json();

      // Salva no SessionStorage pra próxima vez
      sessionStorage.setItem(cacheKey, JSON.stringify(data));

      setBooks(data);
      console.log(`✅ Carregado do servidor: ${data.length} livros`);
    } catch (err) {
      setError(`Erro ao carregar livros: ${err instanceof Error ? err.message : 'Desconhecido'}`);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Catálogo</h1>

      {/* Mostra Status */}
      {loading && <p style={{ color: 'blue' }}>⏳ Carregando...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {/* Lista de Livros */}
      {books.length === 0 && !loading && (
        <p style={{ color: 'gray' }}>Nenhum livro encontrado</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {books.map(book => (
          <div key={book.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            {book.images?.[0] && (
              <img 
                src={book.images[0]} 
                alt={book.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
            )}
            <h3>{book.title}</h3>
            <p><strong>Autor:</strong> {book.author}</p>
            <p><strong>Preço:</strong> R$ {book.price.toFixed(2)}</p>
            <p>{book.description?.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}