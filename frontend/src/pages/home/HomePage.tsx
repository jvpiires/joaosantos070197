import { Layout } from "../../components/Layout/Layout";
import { UnAuthHomePage } from "./unAuthHomePage";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { statsService, type StatsDTO } from "../../services/statsService";
import { MeterGroup } from 'primereact/metergroup';


export const HomePage = () => {
  const { isAuthenticated, userRole } = useAuth();
  const [stats, setStats] = useState<StatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await statsService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <UnAuthHomePage />
      </Layout>
    );
  }

  const values = [
    { value: stats?.totalArtists || 0, label: 'Artists',color: 'var(--green-500)',icon: 'pi pi-music' },
    { value: stats?.totalAlbums || 0, label: 'Albums', color: 'var(--blue-500)',icon: 'pi pi-music' },
  ];

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard</h1>
            {userRole === 'ADMIN' && (
              <span className="bg-black text-white text-xs px-2 py-1 font-bold rounded uppercase mt-2 inline-block">
                Admin Mode
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-bold mb-4 uppercase">Bem-vindo!</h2>
          <p className="font-mono text-gray-600 mb-6">
            Você está logado como <strong>{userRole}</strong>.
          </p>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Carregando estatísticas...</div>
          ) : stats ? (
              <div className="card flex w-full flex-col justify-content-center" style={{color:"black"}}>
                  <MeterGroup values={values} />
              </div>
          ) : (
            <div className="text-center py-8 text-gray-600">Erro ao carregar estatísticas</div>
          )}
        </div>
      </div>
    </Layout>
  );
};