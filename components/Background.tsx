import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-zinc-950">
      {/* Mathematical Grid Overlay */}
      <div className="absolute inset-0 math-grid opacity-20 pointer-events-none"></div>
      
      {/* Radial Gradient Ambient Light */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen"></div>
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen"></div>
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
};

export default Background;