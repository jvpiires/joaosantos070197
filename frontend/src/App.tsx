import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { CadastroPage } from './pages/cadastro/CadastroPage'
import { useAuth } from './contexts/AuthContext'
import { LoginPage } from './pages/login/LoginPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ArtistasPage } from './pages/artistas/ArtistasPage'
import { AlbumsPage } from './pages/albums/AlbumsPage'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ArtistasPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/albuns"
        element={
          <ProtectedRoute>
            <AlbumsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <CadastroPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
