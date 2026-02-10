
import React, { useState, useEffect } from 'react';

interface UploadScreenProps {
  onUpload: (base64: string) => void;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onUpload }) => {
  const [scrollScale, setScrollScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      const newScale = 1 + scrollPos * 0.0002;
      setScrollScale(newScale);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-6 bg-black relative overflow-x-hidden min-h-screen">
      {/* Decorative Background Element */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-rose-900/10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div 
        className="max-w-4xl w-full py-20 space-y-16 text-center relative z-10 transition-transform duration-300 ease-out"
        style={{ transform: `scale(${scrollScale})` }}
      >
        <header className="space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-rose-600/5 border border-rose-600/20 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
            <i className="fa-solid fa-bolt-lightning"></i>
            ARTIX PRO ENGINE V2.0
          </div>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter text-white uppercase italic leading-[0.8] drop-shadow-[0_0_30px_rgba(225,29,72,0.2)]">
            ARTIX <span className="text-rose-600 not-italic block md:inline">STUDIO</span>
          </h1>
          <p className="text-lg text-zinc-500 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto leading-relaxed pt-4">
            MASTER-GRADE AI ENGINE FOR MODERN CREATIVE AGENCIES.
          </p>
        </header>

        <label className="relative block w-full aspect-[2.4/1] border border-zinc-900 hover:border-rose-600 transition-all group cursor-pointer overflow-hidden bg-zinc-950 shadow-[0_50px_100px_rgba(0,0,0,0.8)] rounded-sm">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
            <div className="w-20 h-20 bg-zinc-900 flex items-center justify-center text-3xl text-zinc-700 group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:scale-110 duration-500 shadow-xl">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Import Asset</h3>
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-tighter opacity-70">Supports RAW, JPG, PNG, WEBP (Lossless Import)</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-0 h-1 bg-rose-600 transition-all duration-1000 group-hover:w-full"></div>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-10">
          {[
            { label: 'DEEP ISOLATION', icon: 'fa-scissors', text: 'Preserves micro-details and hair strands.' },
            { label: 'SMART FRAMING', icon: 'fa-crop-simple', text: 'AI Rule-of-Thirds cinematography.' },
            { label: 'MASTER EXPORT', icon: 'fa-diamond', text: 'Zero compression studio master output.' }
          ].map((feature, i) => (
            <div key={feature.label} className={`space-y-4 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000`} style={{ animationDelay: `${i * 200}ms` }}>
              <div className="text-rose-600 text-2xl mb-2 drop-shadow-[0_0_10px_rgba(225,29,72,0.4)]">
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <h4 className="font-black text-white text-[11px] uppercase tracking-[0.2em]">{feature.label}</h4>
              <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tight max-w-[150px] mx-auto">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="w-full border-t border-zinc-900 py-10 mt-20 relative z-10 flex flex-col items-center gap-6">
         <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.5em]">ARTIX SYSTEM INFRASTRUCTURE</div>
         <div className="flex gap-8 text-zinc-800 text-lg">
            <i className="fa-brands fa-google"></i>
            <i className="fa-solid fa-bolt"></i>
            <i className="fa-solid fa-microchip"></i>
         </div>
      </footer>
    </div>
  );
};

export default UploadScreen;
