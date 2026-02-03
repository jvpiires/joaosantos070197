import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/home/HomePage';
import { UsersPage } from './pages/admin/UsersPage';
import { RegionaisPage } from './pages/admin/RegionaisPage';
import { AdminAlbumsPage } from './pages/admin/AdminAlbumsPage';
import { ArtistsPage } from './pages/ArtistsPage';
import { AlbumsPage } from './pages/AlbumsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { Toaster } from 'sonner';
import { useEffect } from 'react';

function AppContent() {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Navegando para:', location.pathname);
  }, [location]);

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
      <Route path="/z_admin/albums" element={<AdminAlbumsPage />} />
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