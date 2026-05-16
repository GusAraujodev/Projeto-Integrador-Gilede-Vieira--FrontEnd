import { useState } from 'react';
import { RefreshCw, Download, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

export default function AdminMLSync() {
  const { books, syncFromML } = useBooks();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncedBooks = books.filter(b => b.mlSynced);

  // Mock ML products for demonstration
  const mockMLProducts = [
    {
      id: 'MLB123456789',
      title: 'A Sutil Arte de Ligar o F*da-se',
      category: 'Autoajuda',
      price: 39.90,
      available_quantity: 20,
      description: 'Um livro revolucionário sobre como viver melhor focando no que realmente importa.',
      pictures: [{ url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800' }],
      attributes: [{ name: 'Autor', value: 'Mark Manson' }]
    }
  ];

  const handleSync = () => {
    setSyncing(true);
    
    // Simulate API call
    setTimeout(() => {
      syncFromML(mockMLProducts);
      setLastSync(new Date());
      setSyncing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-slate-900 dark:text-white mb-2">
          Sincronização com Mercado Livre
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Conecte sua loja do Mercado Livre e importe produtos automaticamente para o site
        </p>
      </div>

      {/* Sync Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <RefreshCw className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl text-slate-900 dark:text-white">
                {syncedBooks.length}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Livros Sincronizados
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Última Sincronização
              </p>
              <p className="text-slate-900 dark:text-white">
                {lastSync ? lastSync.toLocaleString('pt-BR') : 'Nunca'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <AlertCircle className="size-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl text-slate-900 dark:text-white">0</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Conflitos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Action */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-yellow-400 p-3 rounded-lg">
            <Download className="size-6 text-slate-900" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl text-slate-900 dark:text-white mb-2">
              Importar Produtos do Mercado Livre
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Sincronize os livros da sua loja do Mercado Livre diretamente para o site.
              As informações importadas incluem:
            </p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                Título, autor e descrição do produto
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                Preço atualizado e quantidade em estoque
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                Fotos e imagens de capa
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="size-4 text-green-600" />
                Categoria do livro
              </li>
            </ul>
          </div>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
          size="lg"
        >
          {syncing ? (
            <>
              <RefreshCw className="size-4 mr-2 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <Download className="size-4 mr-2" />
              Importar Agora
            </>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
          <AlertCircle className="size-5" />
          Como funciona a integração?
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-blue-800 dark:text-blue-400 mb-3">
              A sincronização com o Mercado Livre permite que você:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-400 ml-4">
              <li>Importe produtos da sua loja do ML para este site automaticamente</li>
              <li>Mantenha preços e estoque sincronizados entre as plataformas</li>
              <li>Atualize informações de produtos com um clique</li>
              <li>Gerencie tudo em um só lugar</li>
            </ol>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded p-4 mt-4">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Dica:</strong> Após importar os produtos, você pode editá-los individualmente 
              na página "Livros" para adicionar informações extras ou ajustar detalhes.
            </p>
          </div>
        </div>
      </div>

      {/* Synced Books */}
      {syncedBooks.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl text-slate-900 dark:text-white mb-4">
            Produtos Sincronizados
          </h2>
          <div className="space-y-3">
            {syncedBooks.map(book => (
              <div
                key={book.id}
                className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-0"
              >
                <div>
                  <p className="text-slate-900 dark:text-white">{book.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {book.author} • R$ {book.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    ML ID: {book.mlId}
                  </Badge>
                  <Badge className="bg-green-600 text-xs">
                    Sincronizado
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API Info */}
      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
        <h3 className="text-slate-900 dark:text-white mb-3">
          Status da Conexão
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge className="bg-yellow-600">Modo Demonstração</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Sua Loja ML:</span>
            <a 
              href="https://lista.mercadolivre.com.br/_CustId_532947791" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Ver no Mercado Livre
              <ArrowRight className="size-3" />
            </a>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-600 pt-3 mt-3">
            <p className="text-xs">
              <strong>Nota:</strong> Esta é uma demonstração da funcionalidade. 
              Em produção, você precisará autenticar sua conta do Mercado Livre 
              através da API oficial para sincronização em tempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
