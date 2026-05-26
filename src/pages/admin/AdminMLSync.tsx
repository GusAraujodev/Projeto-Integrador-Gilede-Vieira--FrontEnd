import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Download, CheckCircle, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useBooks } from '../../contexts/BooksContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

type MlStatus = 'connected' | 'disconnected';

export default function AdminMLSync() {
  const { books, syncFromML } = useBooks();
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [mlStatus, setMlStatus] = useState<MlStatus>('disconnected');
  const [statusLoading, setStatusLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const syncedBooks = books.filter(b => b.mlSynced);

  useEffect(() => {
    const mlParam = searchParams.get('ml');
    const reason = searchParams.get('reason');
    if (!mlParam) return;

    setSearchParams({}, { replace: true });

    if (mlParam === 'connected') {
      setMlStatus('connected');
      setStatusLoading(false);
      handleSync();
    } else if (mlParam === 'error') {
      setMlStatus('disconnected');
      setStatusLoading(false);
      const decoded = reason ? decodeURIComponent(reason) : 'Erro desconhecido na autorização.';
      console.error('Erro OAuth ML:', decoded);
      setErrorMessage(decoded);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const checkStatus = async () => {
      setStatusLoading(true);

      try {
        const token = localStorage.getItem('gilede_jwt');

        if (!token) {
          if (isMounted) {
            setMlStatus('disconnected');
          }
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ml/status`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (response.ok) {
          if (isMounted) {
            setMlStatus('connected');
          }
          return;
        }

        if (isMounted) {
          setMlStatus('disconnected');
        }
      } catch (error) {
        if (!controller.signal.aborted && isMounted) {
          console.error('Erro ao consultar status do Mercado Livre:', error);
          setMlStatus('disconnected');
        }
      } finally {
        if (isMounted) {
          setStatusLoading(false);
        }
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleLinkAccount = async () => {
    setActionLoading(true);

    try {
      const token = localStorage.getItem('gilede_jwt');

      if (!token) {
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ml/auth-url`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar URL de autorização');
      }

      const contentType = response.headers.get('content-type') || '';
      let authUrl = '';

      if (contentType.includes('application/json')) {
        const data = await response.json();
        authUrl = data.authUrl || data.url || data.authorizationUrl || '';
      } else {
        authUrl = (await response.text()).trim();
      }

      if (authUrl) {
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('Erro ao obter URL de autorização do Mercado Livre:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);

    try {
      const token = localStorage.getItem('gilede_jwt');

      if (!token) {
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ml/sync`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao sincronizar o catálogo');
      }

      const data = await response.json().catch(() => null);
      const importedBooks = Array.isArray(data?.books)
        ? data.books
        : Array.isArray(data)
          ? data
          : [];

      if (importedBooks.length > 0) {
        await syncFromML(importedBooks);
      }

      setLastSync(new Date());
      setMlStatus('connected');
    } catch (error) {
      console.error('Erro ao sincronizar catálogo do Mercado Livre:', error);
      setMlStatus('disconnected');
    } finally {
      setSyncing(false);
    }
  };

  const isConnected = mlStatus === 'connected';
  const primaryButtonLabel = statusLoading
    ? 'Verificando conexão...'
    : isConnected
      ? 'Sincronizar Catálogo Manualmente'
      : 'Vincular Conta do Mercado Livre';

  const handlePrimaryAction = async () => {
    if (statusLoading) {
      return;
    }

    if (isConnected) {
      await handleSync();
      return;
    }

    await handleLinkAccount();
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
              Erro na conexão com o Mercado Livre
            </p>
            <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-600 dark:text-red-400 hover:underline mt-2"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

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
            <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {isConnected ? (
                <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="size-6 text-red-600 dark:text-red-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Status da Conta
              </p>
              <Badge className={isConnected ? 'bg-green-600' : 'bg-red-600'}>
                {statusLoading ? 'Verificando...' : isConnected ? 'Conectado' : 'Desconectado'}
              </Badge>
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
          onClick={handlePrimaryAction}
          disabled={syncing || actionLoading || statusLoading}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold"
          size="lg"
        >
          {syncing || actionLoading ? (
            <>
              <RefreshCw className="size-4 mr-2 animate-spin" />
              {isConnected ? 'Sincronizando...' : 'Gerando vínculo...'}
            </>
          ) : (
            <>
              {isConnected ? (
                <Download className="size-4 mr-2" />
              ) : (
                <ExternalLink className="size-4 mr-2" />
              )}
              {primaryButtonLabel}
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

      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-6">
        <h3 className="text-slate-900 dark:text-white mb-3">
          Status da Conexão
        </h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge className={isConnected ? 'bg-green-600' : 'bg-red-600'}>
              {statusLoading ? 'Verificando...' : isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
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
        </div>
      </div>
    </div>
  );
}
