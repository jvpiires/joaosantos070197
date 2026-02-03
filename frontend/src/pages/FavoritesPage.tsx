import { useEffect, useState } from 'react';
import './FavoritesPage.css';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout/Layout';

interface Favorite {
  id: number;
  albumId: number;
  albumTitle: string;
  artistName: string;
  addedAt: string;
}

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  async function loadFavorites() {
    try {
      setLoading(true);
      // Implementar chamada real quando API de favoritos estiver pronta
      // Por enquanto, mostrar página vazia
      setFavorites([]);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  }

  function removeFavorite(id: number) {
    setFavorites(favorites.filter(f => f.id !== id));
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Favoritos</h1>
            <p className="text-gray-600 mt-2 font-mono">Seus álbuns favoritos</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          {!isAuthenticated ? (
            <div className="text-center py-12 text-gray-600">
              <p>Faça login para acessar seus favoritos</p>
            </div>
          ) : loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>Você ainda não tem favoritos</p>
              <p className="text-sm mt-2">Clique no ❤️ para adicionar álbuns aos favoritos</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="p-4 border-2 border-black flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{favorite.albumTitle}</h3>
                    <p className="text-gray-600">{favorite.artistName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Adicionado em {new Date(favorite.addedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="px-4 py-2 bg-red-500 text-white font-bold hover:bg-red-700 transition-all"
                  >
                    Remover ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
