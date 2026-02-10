
import React, { useState } from 'react';
import { ImageAdjustment, TextLayer } from '../types';

interface ExportScreenProps {
  imageUrl: string | null;
  onBack: () => void;
  adjustments: ImageAdjustment;
  textLayers?: TextLayer[];
}

const ExportScreen: React.FC<ExportScreenProps> = ({ imageUrl, onBack, adjustments, textLayers = [] }) => {
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(100);
  const [scale, setScale] = useState(100);
  const [targetSize, setTargetSize] = useState<number>(0);
  const [sizeUnit, setSizeUnit] = useState<'KB' | 'MB'>('KB');

  const handleDownload = () => {
    if (!imageUrl) return;
    
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageUrl;
    img.onload = async () => {
      const finalScale = scale / 100;
      canvas.width = img.width * finalScale;
      canvas.height = img.height * finalScale;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        ctx.filter = 'none';
        textLayers.forEach(layer => {
          const fontSize = layer.fontSize * finalScale;
          ctx.font = `900 ${fontSize}px Inter`;
          ctx.fillStyle = layer.color;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const x = (layer.x / 100) * canvas.width;
          const y = (layer.y / 100) * canvas.height;
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 10 * finalScale;
          ctx.fillText(layer.text.toUpperCase(), x, y);
        });
        
        // Iterative size reduction if targetSize is set
        let finalQuality = quality / 100;
        let blob: Blob | null = null;
        
        if (targetSize > 0) {
          const targetBytes = targetSize * (sizeUnit === 'KB' ? 1024 : 1024 * 1024);
          for (let q = finalQuality; q > 0.1; q -= 0.05) {
            blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${format}`, q));
            if (blob && blob.size <= targetBytes) {
              finalQuality = q;
              break;
            }
          }
        }

        const dataUrl = canvas.toDataURL(`image/${format}`, finalQuality);
        const link = document.createElement('a');
        link.download = `artix_master_${Date.now()}.${format}`;
        link.href = dataUrl;
        link.click();
      }
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-black animate-in fade-in duration-700 overflow-y-auto no-scrollbar">
      <div className="max-w-6xl w-full mx-auto px-6 py-20 flex flex-col lg:flex-row gap-12 items-start justify-center">
        <div className="flex-1 w-full space-y-6">
          <div className="checkerboard rounded-sm overflow-hidden border border-zinc-900 shadow-[0_0_150px_rgba(0,0,0,0.8)]">
             <div className="relative">
                <img src={imageUrl!} alt="ARTIX Render" className="w-full h-auto" style={{
                  filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturation}%)`
                }} />
             </div>
          </div>
          <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
            <i className="fa-solid fa-circle-check text-rose-500"></i>
            MASTER AUTHENTICATED ASSET
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-8 bg-zinc-950 p-10 rounded-sm border border-zinc-900 shadow-2xl shrink-0">
          <header className="space-y-2">
            <h2 className="text-3xl font-black text-white uppercase italic">RENDER <span className="text-rose-600 not-italic">HUB</span></h2>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Output Config</p>
          </header>

          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Master Format</label>
              <div className="grid grid-cols-3 gap-2">
                {['png', 'jpg', 'webp'].map(f => (
                  <button
                    key={f} onClick={() => setFormat(f)}
                    className={`py-3 rounded-sm border text-[10px] font-black uppercase transition-all tracking-widest ${
                      format === f ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-900/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >{f}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                <label>Dimensions / Scale</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" value={scale} onChange={(e) => setScale(parseInt(e.target.value) || 1)}
                    className="w-16 bg-black border border-zinc-800 text-rose-500 text-right p-1 rounded-sm outline-none"
                  />
                  <span className="text-zinc-500">%</span>
                </div>
              </div>
              <input type="range" min="1" max="500" value={scale} onChange={(e) => setScale(parseInt(e.target.value))} className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-rose-600" />
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
               <div className="flex justify-between items-center text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                <label>Target File Size</label>
                <div className="flex items-center gap-1 bg-black rounded p-1">
                   {['KB', 'MB'].map(u => (
                     <button 
                       key={u} onClick={() => setSizeUnit(u as any)}
                       className={`px-2 py-0.5 text-[8px] font-black rounded ${sizeUnit === u ? 'bg-rose-600 text-white' : 'text-zinc-700'}`}
                     >{u}</button>
                   ))}
                </div>
              </div>
              <input 
                type="number" 
                value={targetSize === 0 ? '' : targetSize} 
                onChange={(e) => setTargetSize(parseFloat(e.target.value) || 0)}
                placeholder="Unlimited"
                className="w-full bg-black border border-zinc-800 text-rose-500 p-2 text-xs rounded-sm outline-none focus:border-rose-600"
              />
              <p className="text-[8px] text-zinc-700 uppercase font-bold">Engine will iteratively compress to meet target.</p>
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-zinc-900">
            <button onClick={handleDownload} className="w-full py-5 bg-white text-black rounded-sm font-black text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] shadow-lg">
              <i className="fa-solid fa-download"></i> Process & Export
            </button>
            <button onClick={onBack} className="w-full py-3 text-zinc-600 text-[10px] font-black hover:text-zinc-400 transition-all uppercase tracking-widest">Return to Studio</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportScreen;
