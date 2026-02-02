import React from 'react';
import { Header } from './header/Header';
import { Main } from './main/Main';
import { Footer } from './Footer/Footer';
import { Sidebar } from './sidebar/Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 font-mono">
      <Header />
      <div className="flex flex-1 relative">
        {isAuthenticated && (
          <aside className="hidden md:block w-64 bg-white border-r-2 border-black">
            <Sidebar />
          </aside>
        )}
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <Main>{children}</Main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};