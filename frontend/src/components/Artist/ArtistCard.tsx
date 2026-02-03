import { type Artist } from '../../types/models';
import { Button } from 'primereact/button';

interface ArtistCardProps {
  artist: Artist;
  isAdmin?: boolean;
  onEdit?: (artist: Artist) => void;
  onDelete?: (artist: Artist) => void;
}

export const ArtistCard = ({ artist, isAdmin, onEdit, onDelete }: ArtistCardProps) => {
  return (
    <div className="group relative bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
      
      {/* Avatar/Ícone */}
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-400 transition-colors">
        <span className="text-white text-3xl font-black group-hover:text-black transition-colors">
          {artist.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Nome do Artista */}
      <h3 className="font-black text-xl uppercase tracking-tight leading-tight mb-2">
        {artist.name}
      </h3>

      {/* ID */}
      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-4">
        ID: {artist.id}
      </p>

      {/* Ações (só para admin) */}
      {isAdmin && (
        <div className="flex gap-2 mt-4 pt-4 border-t-2 border-dashed border-gray-200">
          <Button
            icon="pi pi-pencil"
            label="Editar"
            onClick={() => onEdit?.(artist)}
            className="flex-1 text-xs p-2 border-2 border-black bg-white text-black font-bold hover:bg-gray-100 transition-all"
          />
          <Button
            icon="pi pi-trash"
            onClick={() => onDelete?.(artist)}
            className="p-2 border-2 border-red-500 bg-white text-red-500 font-bold hover:bg-red-50 transition-all"
          />
        </div>
      )}
    </div>
  );
};
