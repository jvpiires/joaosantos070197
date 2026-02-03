import { Layout } from '../../components/Layout/Layout';
import { AlbumsDataTable } from '../../components/AlbumsDataTable/AlbumsDataTable';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const AdminAlbumsPage = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Protege rota - só admin pode acessar
    if (!isAuthenticated || userRole !== 'ADMIN') {
      navigate('/');
    }
  }, [isAuthenticated, userRole, navigate]);

  if (!isAuthenticated || userRole !== 'ADMIN') {
    return null;
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Gerenciar Álbuns</h1>
            <p className="text-gray-600 mt-2 font-mono">Crie, edite e delete álbuns com múltiplos artistas</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <AlbumsDataTable />
        </div>
      </div>
    </Layout>
  );
};
