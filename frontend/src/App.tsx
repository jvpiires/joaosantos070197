import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { UsersPage } from './pages/admin/UsersPage';
import { RegionaisPage } from './pages/admin/RegionaisPage';
import { ArtistsPage } from './pages/artists/ArtistsPage';
import { AlbumsPage } from './pages/albums/AlbumsPage';
import { FavoritesPage } from './pages/favorites/FavoritesPage';
import { Toaster } from 'sonner';
function AppContent() {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/artists" element={<ArtistsPage />} />
      <Route path="/albums" element={<AlbumsPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/z_admin/users" element={<UsersPage />} />
      <Route path="/z_admin/regionais" element={<RegionaisPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AppContent />
    </>
  );
}

export default App;