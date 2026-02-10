
import React, { useState, useCallback, useRef } from 'react';
import { 
  Play, 
  Download, 
  Settings, 
  FileText, 
  Mic, 
  Loader2, 
  Sparkles,
  RefreshCw,
  Volume2
} from 'lucide-react';
import { VOICE_OPTIONS, TONE_OPTIONS } from './constants';
import { VoiceName, GenerationState, HinglishConfig } from './types';
import { optimizeHinglishScript, generateSpeech } from './services/geminiService';
import { decodeBase64, createWavBlob } from './utils/audioUtils';

const App: React.FC = () => {
  const [script, setScript] = useState('');
  const [config, setConfig] = useState<HinglishConfig>({
    voice: VoiceName.Kore,
    tone: 'Professional',
    speed: 1.0,
  });
  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    audioUrl: null,
    optimizedScript: null,
  });

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!script.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null, audioUrl: null }));
    
    try {
      // Step 1: Optimize for Hinglish flow and tone
      const optimized = await optimizeHinglishScript(script, config.tone);
      setState(prev => ({ ...prev, optimizedScript: optimized }));

      // Step 2: Generate Speech
      const base64Audio = await generateSpeech(optimized, config.voice, config.tone);
      
      // Step 3: Convert to downloadable WAV
      const pcmData = decodeBase64(base64Audio);
      const wavBlob = createWavBlob(pcmData);
      const url = URL.createObjectURL(wavBlob);
      
      setState(prev => ({ ...prev, audioUrl: url, isGenerating: false }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message || "Failed to generate voiceover. Check your API key." 
      }));
    }
  };

  const handleDownload = () => {
    if (state.audioUrl) {
      const link = document.createElement('a');
      link.href = state.audioUrl;
      link.download = `hinglish-voiceover-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mic className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Hinglish Studio AI
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">Natural AI Voiceover</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-slate-400">
          <span className="text-sm font-medium hover:text-white transition-colors cursor-pointer">Projects</span>
          <span className="text-sm font-medium hover:text-white transition-colors cursor-pointer">Voices</span>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <Settings className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Left Column: Script Input */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass rounded-2xl p-6 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="font-semibold text-lg text-slate-200">Script Editor</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">{script.length} characters</span>
            </div>
            
            <textarea
              className="flex-grow bg-slate-900/50 border border-slate-700/50 rounded-xl p-5 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-lg leading-relaxed placeholder:text-slate-600"
              placeholder="Enter your Hinglish script here... e.g., 'Hello dosto, aaj hum baat karenge AI ke future ke baare mein...'"
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />

            {state.optimizedScript && (
              <div className="mt-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative">
                <div className="flex items-center gap-2 text-indigo-400 mb-2 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  AI Optimized Script
                </div>
                <p className="text-slate-400 text-sm italic leading-relaxed">
                  {state.optimizedScript}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Voice Settings */}
          <div className="glass rounded-2xl p-6 shadow-xl">
            <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              Studio Controls
            </h3>

            {/* Voice Select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-400 mb-2">Voice Model</label>
              <div className="grid grid-cols-1 gap-2">
                {VOICE_OPTIONS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setConfig({ ...config, voice: v.id })}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      config.voice === v.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100'
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.voice === v.id ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                      <Volume2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{v.name} ({v.gender})</div>
                      <div className="text-[10px] opacity-70 mt-0.5 line-clamp-1">{v.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Select */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-3">Emotional Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setConfig({ ...config, tone: t })}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                      config.tone === t
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleGenerate}
                disabled={state.isGenerating || !script}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
                  state.isGenerating || !script
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/25 active:scale-[0.98]'
                }`}
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synthesizing Audio...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Generate Voiceover
                  </>
                )}
              </button>
              
              {state.error && (
                <p className="text-red-400 text-xs text-center mt-2 px-2 py-1 bg-red-500/10 rounded border border-red-500/20">
                  {state.error}
                </p>
              )}
            </div>
          </div>

          {/* Result Player */}
          {state.audioUrl && (
            <div className="glass rounded-2xl p-6 animate-in slide-in-from-bottom-4 duration-500 border-indigo-500/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-200 font-semibold">Generated Audio</h3>
                <button 
                  onClick={handleGenerate}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <audio 
                ref={audioRef}
                src={state.audioUrl} 
                controls 
                className="w-full h-10 mb-6 rounded-lg filter invert hue-rotate-180" 
              />
              
              <button
                onClick={handleDownload}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-600/20"
              >
                <Download className="w-5 h-5" />
                Download Studio WAV
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-slate-600 text-sm flex items-center gap-2">
        <span>Powered by Gemini 2.5 Flash TTS</span>
        <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
        <span>Optimized for Hinglish scripts</span>
      </footer>
    </div>
  );
};

export default App;
