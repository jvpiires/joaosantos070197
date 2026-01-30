import { useState } from "react";
import { Layout } from "../../components/Layout/Layout";

export const HomePage = () => {
// Estados para o Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(30);
  
  // Novo estado para controlar qual música está tocando
  const [currentTrack, setCurrentTrack] = useState({
    title: "Selecione uma música",
    artist: "Aguardando...",
    id: null
  });

  const dataMock = [
    { id: 1, title: "Rock Classics", category: "Classic Rock", ImageUrl: "http://localhost:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcGFzLWFsYnVucy1tZWRpYS9wYXRldGEwOS5naWY_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD0xV1RMN1MxOVRDRUJCWU5JNjEwUyUyRjIwMjYwMTMwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDEzMFQxODIyMTRaJlgtQW16LUV4cGlyZXM9NDMyMDAmWC1BbXotU2VjdXJpdHktVG9rZW49ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmhZMk5sYzNOTFpYa2lPaUl4VjFSTU4xTXhPVlJEUlVKQ1dVNUpOakV3VXlJc0ltVjRjQ0k2TVRjMk9UZzBNRFV4Tnl3aWNHRnlaVzUwSWpvaVlXUnRhVzVmYzNSdmNtRm5aU0o5Ljl5YUVmM1FCTWpfUTZaS2tXZGVLc1FwZHVWLUFqbW1EeHhGVGNiNGQ0S0VwWVhHTGlYQWhMTlZQdXkyRTBIQUhwSS1NZzZpWWlfcjhPUklYREJaZ3VRJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9YzQzZTRkY2U3ZjQzYTNiMzY4NTI3MzQzM2RlOTAzNWQwOTdhODQ0MzljNDc5Y2U2ODUzZDM5NzFlNDMzYzlmMw" },
    { id: 2, title: "Lofi Beats", category: "Estudo & Foco", ImageUrl: "" },
    { id: 3, title: "Techno Night", category: "Eletrônica", ImageUrl: "" },
    { id: 4, title: "Jazz Mood", category: "Relaxante", ImageUrl: "" },
  ];

  const handleCardClick = (item: any) => {
    setCurrentTrack({
      title: item.title,
      artist: "Songs Artist", // Aqui viria do seu banco futuramente
      id: item.id
    });
    setIsPlaying(true); // Começa a tocar automaticamente ao clicar
  };

  return (
    <Layout>
      <section className="container mx-auto px-4 py-12 font-mono">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full max-w-5xl mx-auto">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-tight md:leading-none">
              Seu Artista, <br />
              <span className="text-cyan-400">Seu Album.</span>
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto md:mx-0">
              Explore uma nova forma de achar seus artistas favoritos com o 
              <span className="font-bold text-black"> Songs</span>. 
              Performance e design minimalista em um só lugar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-xs md:max-w-full mx-auto">
            {dataMock.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleCardClick(item)}
                className={`p-4 md:p-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer group ${currentTrack.id === item.id ? 'bg-cyan-50 border-cyan-400' : ''}`}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-3 md:mb-4 overflow-hidden transition-colors ${currentTrack.id === item.id ? 'bg-cyan-400' : 'bg-black group-hover:bg-cyan-400'}`}>
                  <img className={`object-cover ${currentTrack.id === item.id ? 'text-black' : 'text-white group-hover:text-black'}`} src={item.ImageUrl} alt={item.title} />
                </div>
                <h3 className="font-bold text-xs md:text-sm uppercase mb-1">{item.title}</h3>
                <p className="text-[9px] md:text-[10px] text-gray-500 leading-tight uppercase">
                  {item.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};