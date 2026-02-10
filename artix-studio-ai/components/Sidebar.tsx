
import React, { useState } from 'react';
import { ImageAdjustment, TextLayer, ManualCropArea } from '../types';

interface SidebarProps {
  adjustments: ImageAdjustment;
  setAdjustments: (a: ImageAdjustment) => void;
  zoom: number;
  setZoom: (z: number) => void;
  activeTab: 'adjust' | 'crop' | 'bg' | 'text' | 'pro';
  setActiveTab: (t: 'adjust' | 'crop' | 'bg' | 'text' | 'pro') => void;
  onRemoveBG: () => void;
  onSmartCrop: (focus: string, ratio: string) => void;
  onEnhance: () => void;
  isProcessing: boolean;
  undo: () => void;
  reset: () => void;
  canUndo: boolean;
  textLayers: TextLayer[];
  setTextLayers: React.Dispatch<React.SetStateAction<TextLayer[]>>;
  isComparing: boolean;
  setIsComparing: (v: boolean) => void;
  manualCropArea: ManualCropArea | null;
  setManualCropArea: (area: ManualCropArea | null) => void;
  onCommitManualCrop: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  adjustments,
  setAdjustments,
  zoom,
  setZoom,
  activeTab,
  setActiveTab,
  onRemoveBG,
  onSmartCrop,
  onEnhance,
  isProcessing,
  undo,
  reset,
  canUndo,
  textLayers,
  setTextLayers,
  isComparing,
  setIsComparing,
  manualCropArea,
  setManualCropArea,
  onCommitManualCrop
}) => {
  const [customRatio, setCustomRatio] = useState('1:1');
  const [cropUnit, setCropUnit] = useState<'px' | 'in'>('px');
  const DPI = 96;

  const handleAdjustmentChange = (key: keyof ImageAdjustment, val: number) => {
    setAdjustments({ ...adjustments, [key]: val });
  };

  const addTextLayer = () => {
    const newLayer: TextLayer = {
      id: Math.random().toString(36).substr(2, 9),
      text: 'ARTIX STUDIO',
      x: 50,
      y: 50,
      fontSize: 60,
      color: '#ffffff',
      opacity: 100
    };
    setTextLayers([...textLayers, newLayer]);
  };

  const updateTextLayer = (id: string, updates: Partial<TextLayer>) => {
    setTextLayers(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const startManualCrop = () => {
    setManualCropArea({ x: 10, y: 10, width: 80, height: 80 });
  };

  return (
    <aside className="w-80 bg-zinc-950 border-r border-zinc-900 flex flex-col z-20 flex-shrink-0">
      <div className="flex border-b border-zinc-900 overflow-x-auto no-scrollbar bg-black/50">
        {[
          { id: 'adjust', label: 'Tweak', icon: 'fa-sliders' },
          { id: 'crop', label: 'Crop', icon: 'fa-crop-simple' },
          { id: 'bg', label: 'Mask', icon: 'fa-wand-magic-sparkles' },
          { id: 'text', label: 'Text', icon: 'fa-font' },
          { id: 'pro', label: 'Pro', icon: 'fa-microchip' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-w-[64px] py-4 flex flex-col items-center gap-1.5 transition-all text-[9px] font-black uppercase tracking-[0.2em] ${
              activeTab === tab.id ? 'bg-rose-600/10 text-rose-500 border-b-2 border-rose-600' : 'text-zinc-600 hover:text-zinc-300'
            }`}
          >
            <i className={`fa-solid ${tab.icon} text-xs`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar scroll-smooth">
        {activeTab === 'adjust' && (
          <div className="space-y-6">
            <header className="space-y-1">
              <h3 className="text-[11px] font-black text-zinc-100 uppercase tracking-widest">Studio Engine</h3>
            </header>
            <AdjustmentSlider label="Brightness" value={adjustments.brightness} min={0} max={200} onChange={(v) => handleAdjustmentChange('brightness', v)} />
            <AdjustmentSlider label="Contrast" value={adjustments.contrast} min={0} max={200} onChange={(v) => handleAdjustmentChange('contrast', v)} />
            <AdjustmentSlider label="Exposure" value={adjustments.exposure} min={0} max={200} onChange={(v) => handleAdjustmentChange('exposure', v)} />
            <AdjustmentSlider label="Saturation" value={adjustments.saturation} min={0} max={200} onChange={(v) => handleAdjustmentChange('saturation', v)} />
          </div>
        )}

        {activeTab === 'crop' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <header className="space-y-1">
              <h3 className="text-[11px] font-black text-zinc-100 uppercase tracking-widest">Master Framing</h3>
            </header>
            
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'face', label: 'Face Focal', icon: 'fa-user' },
                { id: 'upper', label: 'Portrait', icon: 'fa-id-card' },
                { id: 'object', label: 'Product', icon: 'fa-box' }
              ].map(engine => (
                <button
                  key={engine.id} disabled={isProcessing} onClick={() => onSmartCrop(engine.id, customRatio)}
                  className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm hover:border-rose-600 transition-all text-left flex flex-col gap-2 group disabled:opacity-50"
                >
                  <i className={`fa-solid ${engine.icon} text-zinc-700 group-hover:text-rose-500`}></i>
                  <span className="text-[9px] font-black uppercase tracking-wider">{engine.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Manual Precision</span>
                <button onClick={startManualCrop} className="text-rose-500 text-[10px] font-black uppercase hover:underline">Toggle Handles</button>
              </div>

              {manualCropArea ? (
                <div className="space-y-4 bg-zinc-900 p-4 rounded border border-rose-600/30">
                  <div className="flex gap-2">
                    {['px', 'in'].map(u => (
                      <button 
                        key={u} onClick={() => setCropUnit(u as any)}
                        className={`flex-1 py-1 text-[9px] font-black uppercase border rounded ${cropUnit === u ? 'bg-rose-600 border-rose-600 text-white' : 'border-zinc-800 text-zinc-600'}`}
                      >{u}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-zinc-600 uppercase">Width</label>
                      <input 
                        type="number" 
                        value={cropUnit === 'px' ? Math.round(manualCropArea.width) : (manualCropArea.width / DPI).toFixed(2)} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setManualCropArea({ ...manualCropArea, width: cropUnit === 'px' ? val : val * DPI });
                        }}
                        className="w-full bg-black border border-zinc-800 text-white p-2 text-[10px] rounded outline-none focus:border-rose-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-zinc-600 uppercase">Height</label>
                      <input 
                        type="number" 
                        value={cropUnit === 'px' ? Math.round(manualCropArea.height) : (manualCropArea.height / DPI).toFixed(2)} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setManualCropArea({ ...manualCropArea, height: cropUnit === 'px' ? val : val * DPI });
                        }}
                        className="w-full bg-black border border-zinc-800 text-white p-2 text-[10px] rounded outline-none focus:border-rose-600"
                      />
                    </div>
                  </div>
                  <button onClick={onCommitManualCrop} className="w-full py-3 bg-rose-600 text-white font-black text-[10px] uppercase rounded hover:bg-rose-500 shadow-lg">Apply Manual Crop</button>
                  <button onClick={() => setManualCropArea(null)} className="w-full py-1 text-zinc-600 font-black text-[10px] uppercase hover:text-zinc-400">Cancel</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customRatio} 
                    onChange={(e) => setCustomRatio(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-white p-2 text-xs rounded-sm focus:border-rose-600 outline-none"
                    placeholder="e.g. 16:9"
                  />
                  <button 
                    onClick={() => onSmartCrop('subject', customRatio)}
                    className="bg-rose-600 text-white px-4 text-[10px] font-black uppercase rounded-sm hover:bg-rose-500"
                  >Apply</button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bg' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <header className="space-y-1">
              <h3 className="text-[11px] font-black text-zinc-100 uppercase tracking-widest">ARTIX Isolation</h3>
            </header>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded mb-4">
              <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                Our deep-trace engine removes backgrounds with studio precision, preserving every fine hair and texture.
              </p>
            </div>
            <button
              onClick={onRemoveBG} disabled={isProcessing}
              className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-sm font-black text-xs shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-scissors"></i>}
              Remove Background
            </button>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-6">
             <header className="space-y-1">
              <h3 className="text-[11px] font-black text-zinc-100 uppercase tracking-widest">Typography</h3>
            </header>
            <button onClick={addTextLayer} className="w-full py-3 bg-zinc-900 border border-zinc-800 text-white rounded-sm font-black text-[10px] uppercase hover:bg-zinc-800 flex items-center justify-center gap-2">
              <i className="fa-solid fa-plus text-[10px]"></i> Add Typography
            </button>
            <div className="space-y-4">
              {textLayers.map((l, i) => (
                <div key={l.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded space-y-4 shadow-xl">
                   <div className="flex justify-between items-center text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      <span>Layer #{i+1}</span>
                      <button onClick={() => setTextLayers(textLayers.filter(x => x.id !== l.id))} className="text-rose-500 hover:scale-110 transition-transform"><i className="fa-solid fa-trash"></i></button>
                   </div>
                   <div className="space-y-1">
                     <label className="text-[8px] font-black text-zinc-600 uppercase">Text Content</label>
                     <input 
                      type="text" value={l.text} 
                      onChange={(e) => updateTextLayer(l.id, { text: e.target.value })}
                      className="w-full bg-black border border-zinc-800 text-white p-2 text-xs rounded outline-none focus:border-rose-600"
                     />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                       <label className="text-[8px] font-black text-zinc-600 uppercase">Size</label>
                       <input type="number" value={l.fontSize} onChange={(e) => updateTextLayer(l.id, { fontSize: parseInt(e.target.value) || 1 })} className="w-full bg-black border border-zinc-800 text-white p-2 text-xs rounded" />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[8px] font-black text-zinc-600 uppercase">Color</label>
                       <input type="color" value={l.color} onChange={(e) => updateTextLayer(l.id, { color: e.target.value })} className="w-full h-8 bg-black border border-zinc-800 rounded p-1 cursor-pointer" />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pro' && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <header className="space-y-1">
              <h3 className="text-[11px] font-black text-zinc-100 uppercase tracking-widest">Engine Utilities</h3>
            </header>
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded mb-4">
              <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                The AI Quality Enhancer recovers lost detail, corrects lighting, and optimizes focal points for a master-grade finish.
              </p>
            </div>
            <button
              onClick={onEnhance} disabled={isProcessing}
              className="w-full py-5 border border-rose-600 text-rose-500 hover:bg-rose-600 hover:text-white rounded-sm font-black text-xs transition-all disabled:opacity-50 uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-rose-900/10"
            >
              {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
              AI Quality Enhancer
            </button>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-zinc-900 bg-black/40 space-y-4 flex-shrink-0">
        <div className="flex gap-2">
          <button onClick={undo} disabled={!canUndo || isProcessing} className="flex-1 py-3 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase hover:bg-zinc-800 disabled:opacity-30 transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-rotate-left"></i> Undo</button>
          <button onClick={reset} disabled={isProcessing} className="flex-1 py-3 rounded-sm bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase hover:bg-zinc-800 disabled:opacity-30 transition-all flex items-center justify-center gap-2"><i className="fa-solid fa-arrow-rotate-right"></i> Reset</button>
        </div>
      </div>
    </aside>
  );
};

interface AdjustmentSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({ label, value, min, max, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-zinc-600">
        <span>{label}</span>
        <span className="text-rose-500">{value}%</span>
      </div>
      <input 
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-rose-600"
      />
    </div>
  );
};

export default Sidebar;
