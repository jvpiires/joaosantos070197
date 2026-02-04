import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { artistSchema, type ArtistInput } from '../../types/zod.types';
import { artistService } from '../../services/artistService';
import { albumService } from '../../services/albumService';
import { ImageUploadZone } from '../ui/ImageUploadZone';
import { toast } from 'sonner';

interface CreateArtistModalProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void;
}

interface AlbumOption {
  id: number;
  title: string;
}

export const CreateArtistModal = ({ visible, onHide, onSuccess }: CreateArtistModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [albums, setAlbums] = useState<AlbumOption[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<ArtistInput>({
    resolver: zodResolver(artistSchema), 
  });

  useEffect(() => {
    if (visible) {
      loadAlbums();
    }
  }, [visible]);

  const loadAlbums = async () => {
    try {
      setLoadingAlbums(true);      
      const response = await albumService.getAll({ 
        page: 0,
        size: 100,
        sort: 'title,asc'
      });
     
      const albumOptions = response.content.map(album => ({
        id: album.id,
        title: album.title
      }));
      
      setAlbums(albumOptions);
      
    } catch (error: any) {
      toast.error('Erro ao carregar álbuns', {
        description: 'Não foi possível carregar a lista de álbuns disponíveis.'
      });
    } finally {
      setLoadingAlbums(false);
    }
  };

  const onSubmit = async (data: ArtistInput) => {
    setIsSubmitting(true);
    
    try {
      await artistService.create({
        name: data.name,
        year: data.year ? Number(data.year) : undefined,
        image: selectedImage,
        albumIds: data.albumIds
      });
      
      toast.success('Artista criado com sucesso! 🎵', {
        description: `${data.name} foi adicionado ao sistema.`
      });
      
      reset();
      setSelectedImage(null);
      onHide();
      onSuccess?.();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao criar artista';
      
      toast.error('Erro ao criar artista', {
        description: errorMessage
      });
      
      console.error('Erro ao criar artista:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSelectedImage(null);
      onHide();
    }
  };

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setValue('image', file as any);
  };

  const getErrorMessage = (error: any): string | undefined => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return undefined;
  };

  return (
    <Dialog 
      visible={visible} 
      onHide={handleClose}
      position="center"
      draggable={false}
      resizable={false}
      showHeader={false}
      modal
      className="font-mono border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      contentClassName="p-6 bg-white max-h-[85vh] overflow-y-auto"
      style={{ width: '90vw', maxWidth: '500px' }}
    >
      <div className="flex flex-col space-y-4 p-1">
        
        <div className="text-center space-y-3 m-4b-6">
          <div className="w-14 h-14 bg-black mx-auto flex items-center justify-center rounded-xl">
            <i className="pi pi-microphone text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Novo Artista
          </h2>
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            Preencha os dados do artista
          </p>
        </div>

        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="flex flex-col space-y-5"
        >
          <ImageUploadZone 
            onImageSelect={handleImageSelect}
            error={getErrorMessage(errors.image)}
          />

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Nome do Artista *
            </label>
            <InputText 
              {...register("name")}
              placeholder="Ex: Pink Floyd, The Beatles..."
              disabled={isSubmitting}
              className={`
                border-2 border-black p-3 rounded-none focus:shadow-none font-bold uppercase text-sm transition-all 
                ${errors.name ? 'border-red-500' : 'focus:bg-cyan-50'}
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            {errors.name && (
              <span className="text-[11px] font-bold uppercase mt-1 text-red-500 italic">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Ano de Início/Formação (Opcional)
            </label>
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <InputNumber 
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  placeholder="Ex: 1965"
                  disabled={isSubmitting}
                  useGrouping={false}
                  min={1900}
                  max={new Date().getFullYear()}
                  className={`
                    ${errors.year ? 'p-invalid' : ''}
                  `}
                  inputClassName={`
                    border-2 border-black p-3 rounded-none font-bold text-sm w-full
                    ${errors.year ? 'border-red-500' : 'focus:bg-cyan-50'}
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                />
              )}
            />
            {errors.year && (
              <span className="text-[11px] font-bold uppercase mt-1 text-red-500 italic">
                {errors.year.message}
              </span>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Álbuns (Opcional)
            </label>
            <Controller
              name="albumIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={albums}
                  optionLabel="title"
                  optionValue="id"
                  placeholder={loadingAlbums ? "Carregando álbuns..." : "Selecione álbuns"}
                  disabled={isSubmitting || loadingAlbums}
                  display="chip"
                  filter
                  className="border-2 border-black rounded-none"
                  panelClassName="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                />
              )}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Você pode adicionar álbuns existentes a este artista
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button 
              type="button"
              label="Cancelar" 
              disabled={isSubmitting}
              onClick={handleClose}
              className="flex-1 border-2 border-black text-black py-3 font-black uppercase tracking-[0.1em] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            />
            <Button 
              type="submit"
              label={isSubmitting ? "Criando..." : "Criar"}
              disabled={isSubmitting}
              className="flex-1 border-none bg-black text-white py-3 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
};
