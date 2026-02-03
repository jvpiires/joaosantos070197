import { useAuth } from '../../../contexts/AuthContext';
import { MenuItem } from './MenuItem';
import 'primeicons/primeicons.css'; // Garantir que os ícones funcionem

export const Sidebar = () => {
  const { isAuthenticated, userRole, userLogin } = useAuth();
  const isAdmin = userRole === 'ADMIN';

  return (
    <aside className="w-64 h-full min-h-screen p-6 flex flex-col font-jetbrains">
      
      {/* Navegação Principal */}
      <div className="flex-1 space-y-8 justify-between">
        
        {/* MENU GERAL */}
        <div className="space-y-1 justify-start">
          <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 ">Menu</p>
          <MenuItem icon="pi pi-home" label="Home" to="/home" />
          <MenuItem icon="pi pi-microphone" label="Artistas" to="/artists" />
          <MenuItem icon="pi pi-book" label="Álbuns" to="/albums" />
        </div>

        {/* BIBLIOTECA (Se logado) */}
        {isAuthenticated && (
          <div className="space-y-1">
            <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Sua Biblioteca</p>
            <MenuItem icon="pi pi-heart" label="Favoritos" to="/favorites" />
            <MenuItem icon="pi pi-list" label="Playlists" to="/playlists" />
          </div>
        )}

        {/* ADMINISTRAÇÃO (Se Admin) */}
        {isAdmin && (
          <div className="space-y-1 pt-4 border-t border-gray-100">
            <p className="px-4 text-[11px] font-bold text-red-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <i className="pi pi-shield text-[10px]"></i> Admin Zone
            </p>
            <MenuItem icon="pi pi-plus-circle" label="Novo Artista" to="/z_admin/new-artist" />
            <MenuItem icon="pi pi-folder-open" label="Novo Album" to="/z_admin/new-album" />
            <MenuItem icon="pi pi-users" label="Usuários" to="/z_admin/users" />
            <MenuItem icon="pi pi-map" label="Regionais" to="/z_admin/regionais" />
          </div>
        )}
      </div>

      {/* FOOTER DO USUÁRIO */}
      {isAuthenticated && (
        <div className="mt-6 pt-6  border-t border-gray-100">
          <div className="flex gap-3 items-center group justify-center">
            <div className="flex items-center justify-center font-bold shadow-sm">
              <i className="pi pi-user" style={{ fontSize: '1.5rem' }}></i>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 truncate group-hover:text-cyan-600 transition-colors">
                {userLogin}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-400">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};