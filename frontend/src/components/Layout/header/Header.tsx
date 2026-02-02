import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { AuthModal } from '../../Modal/AuthModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // <--- O SEGREDO ESTÁ AQUI

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Em vez de criar states locais, usamos o estado global do contexto
  const { isAuthenticated, userLogin, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    // Chama o logout do contexto (que limpa storage E estado global)
    logout();

    setShowLogoutConfirm(false);

    // O redirecionamento é opcional se a HomePage já tratar o estado "false",
    // mas garante que o usuário vá para o topo.
    // NÃO USE navigate('/') se estiver causando loop.
    navigate('/');
  };

  return (
    <header style={{ backdropFilter: "blur(16px)" }} className="bg-transparent border-gray-100 sticky top-0 z-50 mt-7 font-mono">
      <div className="max-w-screen-2xl mx-auto px-6 h-auto md:h-16 flex flex-col md:flex-row items-center justify-between relative py-4 md:py-0">
        <div className="hidden md:block flex-1"></div>
        <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex items-center space-x-3 mb-6 md:mb-0">
          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-4xl select-none">⚡</span>
          </div>
          <span className="text-2xl font-black text-black tracking-tighter uppercase italic">
            Songs
          </span>
        </div>
        <div className="flex-1 flex justify-content-end md:justify-end w-full md:w-auto">

          {/* Usa isAuthenticated do Contexto */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <span className="font-bold text-black uppercase mr-4">
                Olá, {userLogin || "usuário"}!
              </span>
              <Button
                label="Logout"
                icon="pi pi-sign-out"
                severity="danger"
                className="px-2 py-2 text-sm font-bold rounded-md transition-all !bg-red-500 !text-white hover:!bg-red-700 hover:scale-105"
                onClick={() => setShowLogoutConfirm(true)}
              />
              <Dialog
                visible={showLogoutConfirm}
                onHide={() => setShowLogoutConfirm(false)}
                showHeader={false}
                className="font-mono border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                contentClassName="p-6 bg-white"
              >
                <div className="flex flex-col items-center space-y-4">
                  <span className="text-lg font-bold">Deseja realizar o logout?</span>
                  <div className="flex space-x-4 w-full justify-around">
                    <Button label="Cancelar"
                      onClick={() => setShowLogoutConfirm(false)}
                      className="text-sm p-2 border-none py-2 mt-2 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    />
                    <Button label="Sair" severity="danger"
                      onClick={handleLogout}
                      className="text-sm p-2 border-none py-2 mt-2 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                    />
                  </div>
                </div>
              </Dialog>
            </div>
          ) : (
            <Button
              label="Login"
              icon="pi pi-user"
              severity="contrast"
              raised
              onClick={() => setShowAuth(true)}
              className="text-sm p-2 border-none py-2 mt-2 font-black uppercase tracking-[0.2em] hover:!bg-cyan-400 hover:!text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1" />
          )}
          <AuthModal visible={showAuth} onHide={() => setShowAuth(false)} />
        </div>
      </div>
    </header>
  );
};