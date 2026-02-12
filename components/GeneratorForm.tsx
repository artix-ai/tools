
import React from 'react';
import { Niche, Expression, ThumbnailConfig, ThumbnailStyle } from '../types';

interface GeneratorFormProps {
  config: ThumbnailConfig;
  onChange: (config: ThumbnailConfig) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ config, onChange, onGenerate, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    onChange({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const setStyle = (style: ThumbnailStyle) => {
    if (style === ThumbnailStyle.CINEMATIC) {
      onChange({
        ...config,
        style,
        includeStamp: false,
        includeArrows: false,
        includeMoney: false,
        expression: Expression.CONFIDENT
      });
    } else {
      onChange({ ...config, style });
    }
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
        <button
          onClick={() => setStyle(ThumbnailStyle.VIRAL)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${config.style === ThumbnailStyle.VIRAL ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Viral Creator
        </button>
        <button
          onClick={() => setStyle(ThumbnailStyle.CINEMATIC)}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${config.style === ThumbnailStyle.CINEMATIC ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Film Studio (8K)
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
          Headline / Title
        </label>
        <input
          type="text"
          name="headline"
          value={config.headline}
          onChange={handleChange}
          maxLength={40}
          placeholder={config.style === ThumbnailStyle.CINEMATIC ? "e.g., THE FUTURE OF TECH" : "e.g., THE BIGGEST SCAM"}
          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Context / Setting
          </label>
          <select
            name="niche"
            value={config.niche}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {/* Fix: Explicitly cast enum values to string array to resolve unknown type error on map callback */}
            {(Object.values(Niche) as string[]).map(n => (
              <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1).replace('-', ' ')}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">
            Subject Persona
          </label>
          <select
            name="expression"
            value={config.expression}
            onChange={handleChange}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            {/* Fix: Explicitly cast enum values to string array to resolve unknown type error on map callback */}
            {(Object.values(Expression) as string[]).map(e => (
              <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Visual Precision
        </label>
        
        <div className="grid grid-cols-2 gap-4">
          <label className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${config.style === ThumbnailStyle.CINEMATIC ? 'opacity-40 grayscale' : 'hover:bg-slate-900/60 bg-slate-900/40'}`}>
            <input
              type="checkbox"
              name="includeArrows"
              checked={config.includeArrows}
              onChange={handleChange}
              disabled={config.style === ThumbnailStyle.CINEMATIC}
              className="w-5 h-5 accent-red-500"
            />
            <span className="text-slate-200 text-sm font-medium">Glow Arrows</span>
          </label>
          
          <label className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${config.style === ThumbnailStyle.CINEMATIC ? 'opacity-40 grayscale' : 'hover:bg-slate-900/60 bg-slate-900/40'}`}>
            <input
              type="checkbox"
              name="includeMoney"
              checked={config.includeMoney}
              onChange={handleChange}
              disabled={config.style === ThumbnailStyle.CINEMATIC}
              className="w-5 h-5 accent-red-500"
            />
            <span className="text-slate-200 text-sm font-medium">Money Stacks</span>
          </label>

          <label className="flex items-center space-x-3 bg-slate-900/40 p-3 rounded-xl cursor-pointer hover:bg-slate-900/60 transition-colors">
            <input
              type="checkbox"
              name="includeParticles"
              checked={config.includeParticles}
              onChange={handleChange}
              className="w-5 h-5 accent-red-500"
            />
            <span className="text-slate-200 text-sm font-medium">Atmos / Haze</span>
          </label>

          <label className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-colors ${config.style === ThumbnailStyle.CINEMATIC ? 'opacity-40 grayscale' : 'hover:bg-slate-900/60 bg-slate-900/40'}`}>
            <input
              type="checkbox"
              name="includeStamp"
              checked={config.includeStamp}
              onChange={handleChange}
              disabled={config.style === ThumbnailStyle.CINEMATIC}
              className="w-5 h-5 accent-red-500"
            />
            <span className="text-slate-200 text-sm font-medium">Overlay Stamp</span>
          </label>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !config.headline}
        className={`w-full font-extrabold py-4 rounded-xl shadow-xl transform transition-all active:scale-95 flex items-center justify-center space-x-2 ${
          config.style === ThumbnailStyle.CINEMATIC 
            ? 'bg-slate-100 text-black hover:bg-white shadow-white/5'
            : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-900/20'
        } disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{config.style === ThumbnailStyle.CINEMATIC ? 'Rendering 8K Textures...' : 'Generating Viral Assets...'}</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{config.style === ThumbnailStyle.CINEMATIC ? 'Render Cinematic Masterpiece' : 'Generate Viral Thumbnail'}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GeneratorForm;
