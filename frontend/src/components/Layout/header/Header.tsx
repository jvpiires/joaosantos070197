import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { AuthModal } from '../../../pages/Auth/AuthModal';

export const Header = () => {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <header style={{backdropFilter: "blur(16px)"}} className="bg-transparent border-gray-100 sticky top-0 z-50 mt-7 font-mono">
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
          <Button 
            label="Login" 
            icon="pi pi-user" 
            severity="contrast"
            raised
            onClick={() => setShowAuth(true)}
            className={`
              px-4 py-2 font-bold rounded-md w-full md:w-auto
              transition-all duration-300 ease-in-out
              !bg-black !text-white border-none
              hover:!bg-cyan-400 hover:!text-black hover:scale-105 hover:cursor-pointer
              active:scale-95
            `}
          />
          <AuthModal visible={showAuth} onHide={() => setShowAuth(false)} />
        </div>
      </div>
    </header>
  );
};