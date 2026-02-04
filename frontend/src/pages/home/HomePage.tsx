import { Layout } from "../../components/Layout/Layout";
import { UnAuthHomePage } from "./unAuthHomePage";
import { useAuth } from "../../contexts/AuthContext";

export const HomePage = () => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated) {
    return (
      <Layout>
        <UnAuthHomePage />
      </Layout>
    );
  }
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
          <p className="font-mono text-gray-600">
            Você está logado como <strong>{userRole}</strong>.
          </p>
          <br />
          <p>
            total de Artistas = 42
            <br /><br />
            total de Álbuns = 128
          </p>
        </div>
      </div>
    </Layout>
  );
};