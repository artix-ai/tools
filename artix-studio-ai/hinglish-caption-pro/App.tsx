
import React, { useState, useRef, useCallback } from 'react';
import { 
  FileVideo, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileType, 
  Zap,
  Globe2,
  ListVideo
} from 'lucide-react';
import { ProcessingStatus, CaptionSegment } from './types';
import { generateCaptions } from './services/geminiService';
import { convertToSRT, downloadSRT } from './utils/srtUtils';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [captions, setCaptions] = useState<CaptionSegment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit for demo
        setError("File size exceeds 20MB. Please use a smaller clip for faster processing.");
        return;
      }
      setFile(selectedFile);
      setCaptions([]);
      setError(null);
      setStatus(ProcessingStatus.IDLE);
    }
  };

  const processFile = async () => {
    if (!file) return;

    try {
      setStatus(ProcessingStatus.PROCESSING);
      setProgressMessage("Initializing AI Transcriber...");
      
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      
      const base64Data = await base64Promise;
      
      setProgressMessage("Analyzing Hinglish audio and generating timestamps...");
      const result = await generateCaptions(base64Data, file.type);
      
      setCaptions(result);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during processing.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (captions.length === 0) return;
    const srtContent = convertToSRT(captions);
    downloadSRT(srtContent, file?.name.split('.')[0] || 'captions');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Hinglish Caption <span className="text-indigo-500">Pro</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">How it works</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            Perfect Hinglish Captions <br /> in Seconds
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Upload your audio or video file. Our specialized AI handles the mix of Hindi and English flawlessly, providing word-for-word accuracy and precise timestamps.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                group relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer
                ${file ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'}
              `}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="video/*,audio/*"
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110
                  ${file ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400'}
                `}>
                  {file ? <FileVideo className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>
                
                {file ? (
                  <div>
                    <p className="text-lg font-medium text-white">{file.name}</p>
                    <p className="text-sm text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm text-zinc-500">Supports MP4, MP3, WAV (Max 20MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                disabled={!file || status === ProcessingStatus.PROCESSING}
                onClick={processFile}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                  ${!file || status === ProcessingStatus.PROCESSING 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-[0.98]'}
                `}
              >
                {status === ProcessingStatus.PROCESSING ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Generate Word-to-Word Captions
                  </>
                )}
              </button>

              {status === ProcessingStatus.PROCESSING && (
                <div className="text-center animate-pulse">
                  <p className="text-indigo-400 text-sm">{progressMessage}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-5">
            <div className="glass-effect rounded-3xl h-[500px] flex flex-col overflow-hidden">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListVideo className="w-5 h-5 text-zinc-400" />
                  <h2 className="font-semibold">Transcription Preview</h2>
                </div>
                {status === ProcessingStatus.COMPLETED && (
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 text-green-400 text-sm font-medium rounded-lg hover:bg-green-600/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download SRT
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {status === ProcessingStatus.IDLE && !file && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 gap-4">
                    <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center">
                      <FileType className="w-6 h-6" />
                    </div>
                    <p>Captions will appear here <br /> after processing</p>
                  </div>
                )}

                {status === ProcessingStatus.PROCESSING && (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse space-y-2">
                        <div className="h-3 w-20 bg-zinc-800 rounded"></div>
                        <div className="h-4 w-full bg-zinc-800 rounded"></div>
                      </div>
                    ))}
                  </div>
                )}

                {status === ProcessingStatus.COMPLETED && captions.length > 0 && (
                  <div className="space-y-4">
                    {captions.map((seg, i) => (
                      <div key={i} className="group p-3 hover:bg-white/5 rounded-xl transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono text-indigo-400 px-1.5 py-0.5 bg-indigo-500/10 rounded">
                            {seg.startTime.toFixed(2)}s - {seg.endTime.toFixed(2)}s
                          </span>
                        </div>
                        <p className="text-zinc-300 group-hover:text-white transition-colors">{seg.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {status === ProcessingStatus.COMPLETED && captions.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                    <p>No speech detected in the provided file.</p>
                  </div>
                )}
              </div>

              <div className="p-5 bg-white/[0.02] border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center">
                      <Globe2 className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      HI
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-700 flex items-center justify-center text-[10px] font-bold">
                      EN
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">Hinglish Core v3.0 Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Native Hinglish Support</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Our models are specifically trained on Indian dialects and the unique mix of Hindi and English vocabulary.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Temporal Accuracy</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Frame-level timestamp precision ensures your captions stay perfectly synced with the speaker.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Download className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold mb-2">Export Ready</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Download standard .SRT files that work instantly with YouTube, Premiere Pro, Final Cut, and more.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Hinglish Caption Pro &copy; 2024</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
