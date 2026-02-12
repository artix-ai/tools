
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CinematicBackground: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Map scroll progress to subtle Y-axis movement for parallax effect
  const beam1Y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const beam2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const beam3Y = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  
  // Opacity fade as we scroll down to focus on content
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020617]">
      <motion.div style={{ opacity }} className="relative w-full h-full">
        {/* Main background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#020617_100%)]" />
        
        {/* Parallax Beams */}
        <motion.div 
          style={{ y: beam1Y }}
          className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full"
        />
        
        <motion.div 
          style={{ y: beam2Y }}
          className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-purple-600/10 blur-[120px] rounded-full"
        />

        <motion.div 
          style={{ y: beam3Y }}
          className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full"
        />

        {/* Floating Particle Simulation (Subtle Static Grain/Noise overlay) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </motion.div>
    </div>
  );
};

export default CinematicBackground;
