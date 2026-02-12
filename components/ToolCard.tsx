
import React from 'react';
import { motion } from 'framer-motion';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  isLiked: boolean;
  onToggleLike: (name: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isLiked, onToggleLike }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative glass p-6 rounded-[2rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_20px_rgba(59,130,246,0.1)] flex flex-col justify-between overflow-hidden"
    >
      {/* Dynamic Glow background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-purple-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-colors duration-500 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="h-14 w-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center text-blue-400 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-500">
            <span className="text-2xl font-black">{tool.name[0]}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onToggleLike(tool.name);
              }}
              className={`p-2 rounded-full transition-all duration-300 ${
                isLiked 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'
              }`}
            >
              <motion.svg 
                animate={{ scale: isLiked ? [1, 1.2, 1] : 1 }}
                className="w-5 h-5" 
                fill={isLiked ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </motion.svg>
            </button>
            <span className="text-[9px] uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-slate-300 px-3 py-1.5 rounded-full font-bold group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-all">
              {tool.category}
            </span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-400 transition-all duration-300">
          {tool.name}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
          {tool.description}
        </p>
      </div>
      
      <div className="relative z-10">
        <a 
          href={tool.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group/btn flex items-center justify-center w-full py-4 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl font-black transition-all duration-500 group-hover:shadow-xl active:scale-[0.98]"
        >
          <span className="tracking-tight uppercase text-xs">Explore Tool</span>
          <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </motion.div>
  );
};

export default ToolCard;
