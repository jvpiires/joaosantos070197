import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import apiClient from '../../services/apiClient';
import { ImageUploadZone } from '../ui/ImageUploadZone';
import { toast } from 'sonner';
import type { Album } from '../../types/models';

interface CreateAlbumModalProps {
  visible: boolean;
  album?: Album | null; // ← Adiciona álbum opcional para edição
  onHide: () => void;
  onSuccess?: () => void;
}

interface ArtistOption {
  id: number;
  name: string;
}

export const CreateAlbumModal = ({ visible, album, onHide, onSuccess }: CreateAlbumModalProps) => {
  const [title, setTitle] = useState('');
  const [artistIds, setArtistIds] = useState<number[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingArtists, setLoadingArtists] = useState(false);

  const isEditMode = !!album; // ← Detecta se é edição

  useEffect(() => {
    if (visible) {
      loadArtists();
      
      // ← Preenche os campos quando está editando
      if (album) {
        setTitle(album.title);
        setArtistIds(album.artists?.map(a => a.id) || []);
      } else {
        setTitle('');
        setArtistIds([]);
        setImageFile(null);
      }
    }
  }, [visible, album]);

  const loadArtists = async () => {
    try {
      setLoadingArtists(true);
      const response = await apiClient.get('/api/v1/artists', {
        params: { page: 0, size: 200, sort: 'name,asc' }
      });
      const data = response.data as any;
      setArtists(data.content || []);
    } catch (error) {
      toast.error('Erro ao carregar artistas', {
        description: 'Não foi possível carregar a lista de artistas.'
      });
    } finally {
      setLoadingArtists(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', title.trim());
      artistIds.forEach(id => formData.append('artistIds', String(id)));
      if (imageFile) formData.append('image', imageFile);

      if (isEditMode && album) {
        // ← Atualiza álbum existente
        await apiClient.put(`/api/v1/albums/${album.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        toast.success('Álbum atualizado com sucesso! 🎵', {
          description: `${title.trim()} foi atualizado.`
        });
      } else {
        // ← Cria novo álbum
        await apiClient.post('/api/v1/albums', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        toast.success('Álbum criado com sucesso! 🎵', {
          description: `${title.trim()} foi adicionado ao sistema.`
        });
      }

      setTitle('');
      setArtistIds([]);
      setImageFile(null);
      onSuccess?.();
      onHide();
    } catch (error) {
      toast.error(`Erro ao ${isEditMode ? 'atualizar' : 'criar'} álbum`, {
        description: `Não foi possível ${isEditMode ? 'atualizar' : 'criar'} o álbum.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setTitle('');
      setArtistIds([]);
      setImageFile(null);
      onHide();
    }
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
  };

  return (
    <Dialog 
      visible={visible} 
      onHide={handleClose}
      draggable={false}
      resizable={false}
      showHeader={false}
      modal
      position="center"
      className="font-mono border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      contentClassName="p-6 bg-white max-h-[85vh] overflow-y-auto"
      style={{ width: '90vw', maxWidth: '500px' }}
    >
      <div className="flex flex-col space-y-6 p-3">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-black mx-auto flex items-center justify-center rounded-xl">
            <i className={`pi ${isEditMode ? 'pi-pencil' : 'pi-compact-disc'} text-white text-3xl`}></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {isEditMode ? 'Editar Álbum' : 'Novo Álbum'}
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {isEditMode ? 'Atualize os dados do álbum' : 'Preencha os dados do álbum'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
          <ImageUploadZone 
            onImageSelect={handleImageSelect}
            currentImageUrl={isEditMode && album?.images?.[0]?.url ? album.images[0].url : undefined}
          />

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Título do Álbum *
            </label>
            <InputText 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Dark Side of the Moon"
              disabled={loading}
              className="border-2 border-black p-3 rounded-none focus:shadow-none font-bold uppercase text-sm transition-all focus:bg-cyan-50"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Artistas (Opcional)
            </label>
            <MultiSelect
              value={artistIds}
              onChange={(e) => setArtistIds(e.value)}
              options={artists}
              optionLabel="name"
              optionValue="id"
              placeholder={loadingArtists ? "Carregando artistas..." : "Selecione artistas"}
              disabled={loading || loadingArtists}
              display="chip"
              filter
              className="border-2 border-black rounded-none"
              panelClassName="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Você pode vincular vários artistas a este álbum
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              type="button"
              label="Cancelar" 
              disabled={loading}
              onClick={handleClose}
              className="flex-1 border-2 border-black text-black py-3 font-black uppercase tracking-[0.1em] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            />
            <Button 
              type="submit"
              label={loading ? (isEditMode ? "Salvando..." : "Criando...") : (isEditMode ? "Salvar" : "Criar")}
              disabled={loading}
              className="flex-1 border-none bg-black text-white py-3 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
};