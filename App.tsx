
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GeminiService } from './services/geminiService';
import { AppView, ImageAdjustment, TextLayer, ManualCropArea } from './types';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import UploadScreen from './components/UploadScreen';
import ExportScreen from './components/ExportScreen';

const INITIAL_ADJUSTMENTS: ImageAdjustment = {
  brightness: 100,
  contrast: 100,
  exposure: 100,
  saturation: 100,
  sharpness: 100,
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('upload');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [adjustments, setAdjustments] = useState<ImageAdjustment>(INITIAL_ADJUSTMENTS);
  const [zoom, setZoom] = useState(100);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [manualCropArea, setManualCropArea] = useState<ManualCropArea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'crop' | 'bg' | 'text' | 'pro'>('adjust');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  
  const geminiRef = useRef<GeminiService | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    geminiRef.current = new GeminiService();
  }, []);

  const scrollToImage = () => {
    if (workspaceRef.current) {
      workspaceRef.current.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  const handleUpload = (base64: string) => {
    setOriginalImage(base64);
    setProcessedImage(base64);
    setView('studio');
    setHistory([base64]);
    setTextLayers([]);
    setZoom(100);
    setManualCropArea(null);
    setTimeout(scrollToImage, 100);
  };

  const handleRemoveBackground = async () => {
    if (!processedImage || !geminiRef.current) return;
    setIsProcessing(true);
    setStatusMessage('Isolating subject with ARTIX Precision...');
    try {
      const result = await geminiRef.current.removeBackground(processedImage);
      setProcessedImage(result);
      setHistory(prev => [...prev, result]);
    } catch (error) {
      alert("Background removal failed.");
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleEnhance = async () => {
    if (!processedImage || !geminiRef.current) return;
    setIsProcessing(true);
    setStatusMessage('Enhancing ARTIX visual fidelity...');
    try {
      const result = await geminiRef.current.enhanceImage(processedImage);
      setProcessedImage(result);
      setHistory(prev => [...prev, result]);
    } catch (error) {
      alert("Enhancement failed.");
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleSmartCrop = async (focus: string, ratio: string) => {
    if (!processedImage || !geminiRef.current) return;
    setIsProcessing(true);
    setStatusMessage(`Applying ARTIX Cinematic ${focus} framing...`);
    try {
      const result = await geminiRef.current.applySmartCrop(processedImage, focus, ratio);
      setProcessedImage(result);
      setHistory(prev => [...prev, result]);
      setManualCropArea(null);
    } catch (error) {
      alert("Crop failed. Please ensure ratio is valid.");
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  const handleManualCropCommit = () => {
    if (!processedImage || !manualCropArea) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = processedImage;
    img.onload = () => {
      const realX = (manualCropArea.x / 100) * img.width;
      const realY = (manualCropArea.y / 100) * img.height;
      const realW = (manualCropArea.width / 100) * img.width;
      const realH = (manualCropArea.height / 100) * img.height;
      canvas.width = realW;
      canvas.height = realH;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, realX, realY, realW, realH, 0, 0, realW, realH);
        const result = canvas.toDataURL('image/png');
        setProcessedImage(result);
        setHistory(prev => [...prev, result]);
        setManualCropArea(null);
      }
    };
  };

  const undo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setProcessedImage(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  const reset = () => {
    if (originalImage) {
      setProcessedImage(originalImage);
      setAdjustments(INITIAL_ADJUSTMENTS);
      setZoom(100);
      setHistory([originalImage]);
      setTextLayers([]);
      setManualCropArea(null);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-zinc-100">
      {view === 'upload' && <UploadScreen onUpload={handleUpload} />}
      
      {view === 'studio' && (
        <>
          <Sidebar 
            adjustments={adjustments}
            setAdjustments={setAdjustments}
            zoom={zoom}
            setZoom={setZoom}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onRemoveBG={handleRemoveBackground}
            onSmartCrop={handleSmartCrop}
            onEnhance={handleEnhance}
            isProcessing={isProcessing}
            undo={undo}
            reset={reset}
            canUndo={history.length > 1}
            textLayers={textLayers}
            setTextLayers={setTextLayers}
            isComparing={isComparing}
            setIsComparing={setIsComparing}
            manualCropArea={manualCropArea}
            setManualCropArea={setManualCropArea}
            onCommitManualCrop={handleManualCropCommit}
          />

          <main className="flex-1 relative flex flex-col bg-zinc-950 shadow-2xl overflow-hidden">
            <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-black/80 backdrop-blur-md z-30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-rose-600 flex items-center justify-center">
                  <i className="fa-solid fa-bolt-lightning text-xs text-white"></i>
                </div>
                <h1 className="font-black tracking-tighter text-xl uppercase italic">ARTIX <span className="text-zinc-500 font-normal not-italic">STUDIO</span></h1>
              </div>
              
              <div className="flex items-center gap-4">
                {isProcessing && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-widest animate-pulse">
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>{statusMessage}</span>
                  </div>
                )}
                <div className="flex gap-2">
                   <button onClick={() => setView('upload')} className="px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 transition-all text-xs font-bold border border-zinc-800 uppercase">Load New</button>
                   <button onClick={() => setView('export')} className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-1.5 rounded transition-all text-xs font-black uppercase shadow-lg shadow-rose-900/20">Export Pro</button>
                </div>
              </div>
            </div>

            <div 
              ref={workspaceRef}
              className="flex-1 overflow-auto bg-[#080808] relative no-scrollbar select-none"
              onWheel={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  e.preventDefault();
                  setZoom(prev => Math.min(Math.max(10, prev - e.deltaY / 5), 500));
                }
              }}
            >
              <div className="inline-flex min-w-full min-h-full items-center justify-center p-[50vh]">
                <div className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-black rounded-sm border border-zinc-900 transition-transform duration-100 ease-out flex-shrink-0">
                  <ImageCanvas 
                    imageUrl={isComparing ? originalImage : processedImage} 
                    adjustments={isComparing ? INITIAL_ADJUSTMENTS : adjustments} 
                    zoom={zoom}
                    textLayers={isComparing ? [] : textLayers}
                    setTextLayers={setTextLayers}
                    manualCropArea={manualCropArea}
                    setManualCropArea={setManualCropArea}
                  />
                  
                  {isComparing && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-zinc-900/80 backdrop-blur rounded border border-rose-600/50 text-[10px] font-black text-rose-500 uppercase tracking-widest pointer-events-none z-50">
                      ORIGINAL VIEW
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-zinc-900/95 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all hover:border-zinc-700">
               <button 
                  onMouseDown={() => setIsComparing(true)}
                  onMouseUp={() => setIsComparing(false)}
                  onMouseLeave={() => setIsComparing(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    isComparing ? 'bg-rose-600 text-white' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                  }`}
               >
                 <i className="fa-solid fa-code-compare"></i>
                 Quick Compare
               </button>
               <div className="w-[1px] h-4 bg-zinc-800" />
               <div className="flex items-center gap-3 px-2">
                 <button onClick={() => setZoom(prev => Math.max(10, prev - 10))} className="text-zinc-500 hover:text-white"><i className="fa-solid fa-minus text-xs"></i></button>
                 <span className="text-[10px] font-black text-rose-500 w-12 text-center">{Math.round(zoom)}%</span>
                 <button onClick={() => setZoom(prev => Math.min(500, prev + 10))} className="text-zinc-500 hover:text-white"><i className="fa-solid fa-plus text-xs"></i></button>
               </div>
               <div className="w-[1px] h-4 bg-zinc-800" />
               <button 
                  onClick={scrollToImage}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
               >
                 <i className="fa-solid fa-arrows-to-dot"></i>
                 Recenter
               </button>
            </div>
          </main>
        </>
      )}

      {view === 'export' && (
        <ExportScreen 
          imageUrl={processedImage} 
          onBack={() => setView('studio')} 
          adjustments={adjustments}
          textLayers={textLayers}
        />
      )}
    </div>
  );
};

export default App;
