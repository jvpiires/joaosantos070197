import React from 'react';

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-grow container mx-auto">
      {children}
    </main>
  );
};