
import React from 'react';

interface ThumbnailDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const ThumbnailDisplay: React.FC<ThumbnailDisplayProps> = ({ imageUrl, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full aspect-video rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-4 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent animate-pulse"></div>
        <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Rendering Cinematic Elements...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="w-full aspect-video rounded-3xl bg-slate-900 border border-slate-800 border-dashed flex flex-col items-center justify-center space-y-4 shadow-inner text-center p-8">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-300">No Thumbnail Generated</h3>
          <p className="text-slate-500 mt-1 max-w-xs mx-auto">Configure your options and click generate to see the magic happen.</p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `youtube-thumbnail-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative group overflow-hidden rounded-3xl shadow-2xl border border-white/5 ring-1 ring-white/10">
        <img
          src={imageUrl}
          alt="Generated Viral Thumbnail"
          className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={handleDownload}
            className="bg-white text-black font-bold px-8 py-3 rounded-full flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-all hover:bg-red-500 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download High Res (16:9)</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold leading-none">Generation Successful</p>
            <p className="text-slate-500 text-sm mt-1">1280x720 • 16:9 Aspect Ratio</p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="text-slate-400 hover:text-white transition-colors p-2"
          title="Download"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ThumbnailDisplay;
