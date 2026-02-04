import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FavoritesPage.css';
import { Layout } from '../../components/Layout/Layout';
import { favoriteService } from '../../services/favoriteService';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { type Album } from '../../types/models';
import { toast } from 'sonner';

export const FavoritesPage = () => {
  const { userRole, userId } = useAuth();
  const isUser = userRole === 'USER';
  const isAdmin = userRole === 'ADMIN';
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAlbum, setExpandedAlbum] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUser && !isAdmin) {
      navigate('/');
    }
  }, [isUser, isAdmin, navigate]);

  useEffect(() => {
    if (isUser || isAdmin) {
      loadFavorites();
    }
  }, [userId, isUser, isAdmin]);

  async function loadFavorites() {
    if (!userId) return;

    try {
      setLoading(true);
      const favoriteIds = await favoriteService.getUserFavorites(userId);
      const validIds = favoriteIds.filter(id => id != null && !isNaN(id));
      
      if (validIds.length === 0) {
        setAlbums([]);
        return;
      }

      const albumPromises = validIds.map(id =>
        apiClient.get<Album>(`/api/v1/albums/${id}`)
      );

      const albumResponses = await Promise.all(albumPromises);
      const albumsData = albumResponses
        .map(response => response.data)
        .filter(album => {
          const isValid = album && album.id;
          if (!isValid) {
            console.warn('Invalid album found:', album);
          }
          return isValid;
        });

      setAlbums(albumsData);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  }

  const removeFavorite = async (e: React.MouseEvent, albumId: number | undefined) => {
    e.stopPropagation();

    if (!userId || !albumId) {
      console.error('UserId or albumId is missing', { userId, albumId });
      return;
    }

    try {
      await favoriteService.removeFavorite(userId, albumId);
      setAlbums(prev => prev.filter(album => album.id !== albumId));
      toast.success('Álbum removido dos favoritos');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Não foi possível remover favorito');
    }
  };

  if (!isUser && !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              Meus Favoritos
            </h1>
            <p className="text-gray-600 mt-2 font-mono">
              {albums.length} {albums.length === 1 ? 'álbum favorito' : 'álbuns favoritos'}
            </p>
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : albums.length === 0 ? (
            <div className="text-center py-12">
              <i className="pi pi-heart text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 font-mono">Nenhum álbum favoritado ainda</p>
              <p className="text-gray-400 text-sm mt-2">
                Adicione álbuns aos favoritos para vê-los aqui
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                  onClick={() => setExpandedAlbum(expandedAlbum === album.id ? null : album.id)}
                >
                  <div className="p-4 space-y-3">
                    <div className="relative">
                      <button
                        onClick={(e) => removeFavorite(e, album.id)}
                        className="absolute -top-2 -right-2 z-10 bg-white border-2 border-black p-2 hover:bg-red-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <i className="pi pi-heart-fill text-red-500 text-sm"></i>
                      </button>
                      <div className="w-full aspect-square border-2 border-black overflow-hidden bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                        {album.images && album.images.length > 0 ? (
                          <img
                            src={album.images[0].url}
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-600">
                            <i className="pi pi-image text-5xl mb-2"></i>
                            <p className="text-xs font-mono">Sem imagem</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-black text-sm uppercase line-clamp-2">{album.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 font-mono">
                        {album.artists?.length || 0} artista(s)
                      </p>
                    </div>

                    <div className="text-right text-sm">
                      {expandedAlbum === album.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedAlbum === album.id && (
                    <div className="bg-gray-50 border-t-2 border-black p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-xs uppercase mb-2">Artistas</h4>
                        {album.artists && album.artists.length > 0 ? (
                          <ul className="space-y-1">
                            {album.artists.map(artist => (
                              <li key={artist.id} className="text-xs font-mono list-none">
                                • {artist.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-500">Sem artistas</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 font-mono">
                        <p>ID: {album.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
