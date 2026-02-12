
import React from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <header className="py-12 md:py-20 text-center relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative inline-flex items-center justify-center mb-8 space-x-3"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
        <a 
          href="https://artix.digital" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative bg-slate-900 border border-white/10 text-white px-6 py-2.5 rounded-full shadow-2xl group transition-all hover:border-blue-500/50"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center">
            <span className="text-blue-500 mr-2">●</span>
            ARTIX <span className="text-slate-500 mx-2">|</span> DIGITAL
            <svg className="w-3 h-3 ml-2 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </span>
        </a>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]"
      >
        <span className="shimmer-text">ARTIX</span><br/>
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">AI DIRECTORY</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-3xl mx-auto text-slate-400 text-lg md:text-2xl font-medium leading-relaxed px-4"
      >
        A curated cinematic nexus of <span className="text-white font-bold">500+ breakthrough AI models</span>.<br className="hidden md:block"/>
        Powered by the <a href="https://artix.digital" className="text-blue-400 hover:underline decoration-blue-400/30">ARTIX.DIGITAL</a> ecosystem.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-12 flex justify-center space-x-12"
      >
        <div className="text-center">
          <p className="text-2xl font-black text-white tracking-tighter">500+</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Verified Tools</p>
        </div>
        <div className="w-px h-10 bg-slate-800 self-center"></div>
        <div className="text-center">
          <p className="text-2xl font-black text-white tracking-tighter">13</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Categories</p>
        </div>
        <div className="w-px h-10 bg-slate-800 self-center"></div>
        <div className="text-center">
          <p className="text-2xl font-black text-white tracking-tighter">ARTIX</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">CORE ENGINE</p>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
