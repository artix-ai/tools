
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ToolCard from './components/ToolCard';
import CinematicBackground from './components/CinematicBackground';
import { AI_TOOLS } from './data/aiDatabase';
import { AICategory } from './types';

const CATEGORIES: AICategory[] = [
  'All',
  'Favorites',
  'Large Language Models',
  'Image Generation',
  'Video & Motion',
  'Audio & Music',
  'Coding & Development',
  'Marketing & SEO',
  'Business & Productivity',
  'Design & UI',
  'Research & Data',
  'Social Media',
  'Gaming',
  'Legal & Compliance'
];

const STORAGE_KEY = 'ai_directory_liked_tools';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AICategory>('All');
  const [likedTools, setLikedTools] = useState<Set<string>>(new Set());

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setLikedTools(new Set(parsed));
        }
      } catch (e) {
        console.error('Failed to parse liked tools from storage', e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(likedTools)));
  }, [likedTools]);

  const toggleLike = (name: string) => {
    setLikedTools(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = false;
      if (activeCategory === 'All') {
        matchesCategory = true;
      } else if (activeCategory === 'Favorites') {
        matchesCategory = likedTools.has(tool.name);
      } else {
        matchesCategory = tool.category === activeCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, likedTools]);

  return (
    <div className="min-h-screen selection:bg-blue-500/50 relative">
      <CinematicBackground />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        <Header />
        
        {/* Search Bar Container */}
        <section className="mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-[2rem] blur-2xl opacity-10 group-focus-within:opacity-30 transition duration-1000"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search the future (e.g. 'coding', 'video')..."
                className="w-full bg-slate-900/60 border border-white/10 rounded-[2rem] px-8 py-6 pl-16 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-xl backdrop-blur-3xl shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>
          
          {/* Category Scroller */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.1em] transition-all duration-500 border flex items-center space-x-2 ${
                  activeCategory === cat 
                    ? 'bg-blue-600 border-transparent text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                } ${cat === 'Favorites' ? 'text-red-400/80 hover:text-red-400' : ''}`}
              >
                {cat === 'Favorites' && (
                  <svg className="w-3.5 h-3.5" fill={activeCategory === 'Favorites' ? "white" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                <span>{cat}</span>
                {cat === 'Favorites' && likedTools.size > 0 && (
                   <span className="ml-1 bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{likedTools.size}</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Directory Header Info */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Directory Grid</h2>
            <div className="h-px w-12 bg-slate-800"></div>
            <p className="text-blue-400 font-bold text-sm">
              {filteredTools.length} Resources Detected
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/40 px-4 py-2 rounded-full border border-white/5">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
             <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">ARTIX CORE ONLINE</span>
          </div>
        </div>

        {/* Directory Grid */}
        <motion.main layout>
          <AnimatePresence mode="popLayout">
            {filteredTools.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              >
                {filteredTools.map((tool, idx) => (
                  <ToolCard 
                    key={tool.name} 
                    tool={tool} 
                    isLiked={likedTools.has(tool.name)}
                    onToggleLike={toggleLike}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 text-center glass rounded-[3rem] border border-dashed border-white/5"
              >
                <div className="w-24 h-24 bg-slate-900/80 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700 shadow-2xl">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {activeCategory === 'Favorites' ? 'No favorites yet' : 'No signals found'}
                </h3>
                <p className="text-slate-500 mt-3 text-lg">
                  {activeCategory === 'Favorites' 
                    ? "Start liking tools to build your personalized library." 
                    : "Your search parameters returned no results from the database."}
                </p>
                <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                  className="mt-8 px-8 py-3 bg-white text-black font-black uppercase text-xs rounded-full hover:scale-105 transition-transform"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        <footer className="mt-40 py-20 border-t border-white/5 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            <div>
              <h4 className="text-white font-black uppercase tracking-widest mb-6 underline decoration-blue-500/50 underline-offset-8 decoration-2">ARTIX STUDIO</h4>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                The world's most comprehensive directory of artificial intelligence tools, curated daily for the modern innovator.
              </p>
              <a 
                href="https://artix.digital" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors group"
              >
                VISIT ARTIX.DIGITAL
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-black uppercase tracking-widest mb-2">Navigation</h4>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Submit Tool</a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">API Documentation</a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Advertising</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h4 className="text-white font-black uppercase tracking-widest mb-2">Connect</h4>
              <a href="https://artix.digital" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Official Website</a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">X / Twitter</a>
              <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors text-sm">Discord Community</a>
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
              © 2025 ARTIX.DIGITAL | ALL RIGHTS RESERVED.
            </p>
            <div className="flex space-x-6 items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Powered by ARTIX CORE</span>
               <div className="w-px h-4 bg-slate-800"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-900/50">Gemini 2.5 Integrated</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
