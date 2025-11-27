import React from 'react';

const ScannerOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
      {/* Vertical Scan Line - Uses global CSS keyframes */}
      <div className="absolute left-0 w-full h-[2px] bg-neon shadow-[0_0_15px_rgba(0,255,157,0.8)] animate-scan-line"></div>
      
      {/* Digital Noise Overlay */}
      <div className="absolute inset-0 bg-neon/5 mix-blend-overlay"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_2px),linear-gradient(90deg,transparent_2px,#000_2px)] bg-[size:20px_20px] opacity-10"></div>

      {/* Data Extraction Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
         <div className="bg-black/80 px-4 py-1 rounded border border-neon/40 backdrop-blur-sm">
           <span className="font-mono text-[10px] text-neon font-bold animate-pulse whitespace-nowrap flex items-center gap-2">
             <span className="w-2 h-2 bg-neon rounded-full"></span>
             VERİ AYIKLANIYOR...
           </span>
         </div>
      </div>
      
      {/* HUD Corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-neon/60"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-neon/60"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-neon/60"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-neon/60"></div>
    </div>
  );
};

export default ScannerOverlay;