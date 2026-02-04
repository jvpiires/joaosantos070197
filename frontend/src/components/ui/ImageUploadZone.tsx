import { useState, useRef } from 'react';

interface ImageUploadZoneProps {
  onImageSelect: (file: File | null) => void;
  error?: string;
}

export const ImageUploadZone = ({ onImageSelect, error }: ImageUploadZoneProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onImageSelect(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        Imagem do Artista (Opcional)
      </label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-3 border-dashed rounded-none p-6 cursor-pointer
          transition-all duration-200 group
          ${isDragging ? 'border-cyan-500 bg-cyan-50 scale-[1.02]' : 'border-black hover:border-cyan-400 hover:bg-gray-50'}
          ${error ? 'border-red-500 bg-red-50' : ''}
          ${preview ? 'border-solid' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-40 object-cover border-2 border-black"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black text-white p-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 transition-colors"
            >
              <i className="pi pi-times text-lg"></i>
            </button>
            <div className="mt-3 text-center">
              <p className="text-xs font-bold uppercase text-gray-600">
                Clique para alterar ou arraste outra imagem
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 bg-black flex items-center justify-center rounded-lg group-hover:bg-cyan-400 transition-colors">
              <i className="pi pi-cloud-upload text-white text-3xl group-hover:text-black"></i>
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-black uppercase tracking-tight">
                Arraste uma imagem aqui
              </p>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                ou clique para selecionar
              </p>
              <p className="text-[10px] text-gray-400 mt-2">
                JPG, PNG ou WEBP • Máximo 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-[11px] font-bold uppercase text-red-500 italic">
          {error}
        </span>
      )}
    </div>
  );
};
