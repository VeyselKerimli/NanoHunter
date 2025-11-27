import React from 'react';
import { Radar, History } from 'lucide-react';

interface HeaderProps {
  onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick }) => {
  return (
    <header className="w-full p-5 border-b border-void-700 bg-void-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Radar className="w-7 h-7 text-neon animate-pulse-slow" />
              <div className="absolute inset-0 bg-neon blur-lg opacity-30 rounded-full"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-white leading-none">
              NANO<span className="text-neon">HUNTER</span>
            </h1>
          </div>
          <p className="text-[10px] text-gray-500 font-mono tracking-[0.3em] uppercase pl-10 mt-1">
            Next-Gen Visual Synthesis Core
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-500 border-r border-void-700 pr-4">
            <span className="px-2 py-0.5 border border-void-700 rounded bg-void-800">SYS.V.2.0</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_5px_theme('colors.neon.DEFAULT')]"></span>
              ONLINE
            </span>
          </div>

          <button 
            onClick={onHistoryClick}
            className="flex items-center gap-2 px-3 py-2 text-xs font-mono font-bold bg-void-800 border border-void-700 rounded hover:border-neon/50 hover:text-neon transition-all group"
          >
            <History size={14} className="group-hover:rotate-[-45deg] transition-transform" />
            <span className="hidden sm:inline">GEÇMİŞ</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;