import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './AlbumsPage.css';
import { Layout } from '../components/Layout/Layout';
import apiClient from '../services/apiClient';

interface Artist {
  id: number;
  name: string;
}

interface Album {
  id: number;
  title: string;
  artists: Artist[];
  createdAt: string;
}

export const AlbumsPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAlbum, setExpandedAlbum] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const artistId = searchParams.get('artistId');

  useEffect(() => {
    loadAlbums();
  }, [artistId]);

  async function loadAlbums() {
    try {
      setLoading(true);
      const params: any = {};
      if (artistId) params.artistId = artistId;
      
      const response = await apiClient.get('/api/v1/albums', { params });
      setAlbums(response.data.content || response.data);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {artistId ? `Álbuns do Artista` : 'Todos os Álbuns'}
            </h1>
            <p className="text-gray-600 mt-2 font-mono">Descubra nossos álbuns e seus artistas</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : albums.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Nenhum álbum encontrado</div>
          ) : (
            <div className="albums-grid">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className={`album-card ${expandedAlbum === album.id ? 'expanded' : ''}`}
                >
                  <div className="album-header" onClick={() => setExpandedAlbum(expandedAlbum === album.id ? null : album.id)}>
                    <div className="album-title-section">
                      <h3 className="album-title">{album.title}</h3>
                      <p className="album-meta">{album.artists.length} artista(s)</p>
                    </div>
                    <div className="expand-icon">
                      {expandedAlbum === album.id ? '▼' : '▶'}
                    </div>
                  </div>

                  {expandedAlbum === album.id && (
                    <div className="album-details">
                      <div className="artists-section">
                        <h4>Artistas</h4>
                        {album.artists.length > 0 ? (
                          <ul className="artists-list">
                            {album.artists.map(artist => (
                              <li key={artist.id} className="artist-item">
                                <span className="artist-name">{artist.name}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-artists">Nenhum artista vinculado</p>
                        )}
                      </div>
                      <div className="album-meta-section">
                        <p><strong>ID:</strong> {album.id}</p>
                        <p><strong>Criado em:</strong> {new Date(album.createdAt).toLocaleDateString('pt-BR')}</p>
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
