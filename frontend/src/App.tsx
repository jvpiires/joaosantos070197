import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/home/HomePage';
import { Toaster } from 'sonner';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/" replace /> : <HomePage />} />
        <Route path="*" element={isAuthenticated ? <Navigate to="/" replace /> : <HomePage/>} />
      </Routes>
    </>
  );
}
export default App;