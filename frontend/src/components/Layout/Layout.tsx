import React from 'react';
import { Header } from './header/Header';
import { Main } from './main/Main';
import { Footer } from './Footer/Footer';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};