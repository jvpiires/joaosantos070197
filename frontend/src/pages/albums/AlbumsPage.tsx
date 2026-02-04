import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './AlbumsPage.css';
import { Layout } from '../../components/Layout/Layout';
import apiClient from '../../services/apiClient';
import { Paginator } from 'primereact/paginator';
import { CreateAlbumModal } from '../../components/Modal/CreateAlbumModal';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useAuth } from '../../contexts/AuthContext';
import { type Album, type Pageable } from '../../types/models';

export const AlbumsPage = () => {
  const { userRole } = useAuth();
  const isAdmin = userRole === 'ADMIN';

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAlbum, setExpandedAlbum] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const artistId = searchParams.get('artistId');

  const [searchTerm, setSearchTerm] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(8);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin || userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [isAdmin, userRole, navigate]);

  if (!isAdmin || userRole !== 'ADMIN') {
    return null;
  }

  const toggleFavorite = (e: React.MouseEvent, albumId: number) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(albumId)) {
        newFavorites.delete(albumId);
      } else {
        newFavorites.add(albumId);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    setFirst(0);
    loadAlbums(0, rows);
  }, [artistId, searchTerm]);

  useEffect(() => {
    loadAlbums(first, rows);
  }, [first, rows]);

  async function loadAlbums(firstParam = first, rowsParam = rows) {
    try {
      setLoading(true);
      const params: any = {
        page: Math.floor(firstParam / rowsParam),
        size: rowsParam,
        sort: 'title,asc'
      };
      if (artistId) params.artistId = artistId;
      if (searchTerm.trim()) params.title = searchTerm.trim();

      const response = await apiClient.get<Pageable<Album>>('/api/v1/albums', { params });

      const data = response.data;
      setAlbums(data.content || []);
      setTotalRecords(data.totalElements || 0);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">
              {artistId ? `Álbuns do Artista` : 'Todos os Álbuns'}
            </h1>
            <p className="text-gray-600 mt-2 font-mono">Descubra nossos álbuns e seus artistas</p>
          </div>
        </div>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-black uppercase">
          </h1>
          {isAdmin && (
            <Button
              label="Novo Álbum"
              icon="pi pi-plus"
              severity='contrast'
              onClick={() => setShowCreateModal(true)}
              className="border-none bg-black text-white px-6 py-3 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            />
          )}
        </div>

        <div className="flex gap-2 items-center bg-white p-4 border-2 border-black">
          <i className="pi pi-search text-gray-600"></i>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título..."
            className="flex-1 border-none bg-transparent p-0 text-base focus:outline-none focus:shadow-none placeholder-gray-400"
          />
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : albums.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Nenhum álbum encontrado</div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                    onClick={() => setExpandedAlbum(expandedAlbum === album.id ? null : album.id)}
                  >
                    <div className="p-4 space-y-3">
                      <div className="relative -mb-12">
                        <button
                          onClick={(e) => toggleFavorite(e, album.id)}
                          className="absolute -top-6 -left-2 bg-white border-2 border-black p-2.5 hover:bg-pink-50 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        >
                          <i
                            className={`pi text-base ${
                              favorites.has(album.id)
                                ? 'pi-heart-fill text-red-500'
                                : 'pi-heart text-gray-600'
                            }`}
                          ></i>
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

              <div className="mt-6 border-t-2 border-black pt-4 flex justify-center">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                rowsPerPageOptions={[4, 8, 12, 16]}
                onPageChange={(e) => {
                  setFirst(e.first);
                  setRows(e.rows);
                }}
              />
              </div>
            </>
          )}
        </div>

        <CreateAlbumModal
          visible={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          onSuccess={() => loadAlbums(0, rows)}
        />
      </div>
    </Layout>
  );
};