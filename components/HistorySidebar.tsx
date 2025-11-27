import React from 'react';
import { X, Clock, ChevronRight, Trash2, FileText } from 'lucide-react';
import { HistoryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onRestore: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

const HistorySidebar: React.FC<Props> = ({ isOpen, onClose, history, onRestore, onClearHistory }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 md:w-96 bg-[#080808] border-l border-void-700 shadow-2xl z-[70] transform transition-transform duration-300 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* Header */}
        <div className="p-5 border-b border-void-700 flex items-center justify-between bg-void-900/50">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-neon" />
            <h2 className="font-mono font-bold text-white">İŞLEM GEÇMİŞİ</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 font-mono text-xs text-center opacity-50">
              <Clock size={48} className="mb-4" />
              <p>HENÜZ KAYIT YOK</p>
              <p className="mt-1 text-[10px]">Yapılan analizler burada listelenir.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onRestore(item)}
                className="group relative bg-void-800 border border-void-700 rounded-lg p-3 hover:border-neon/40 hover:bg-void-700 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-mono text-neon bg-neon/10 px-1.5 py-0.5 rounded">
                    {item.aspectRatio}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-black rounded flex items-center justify-center border border-void-600 text-gray-500">
                    <FileText size={16} />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate w-full">{item.imageName}</h4>
                    <p className="text-[10px] text-gray-400 truncate w-full mt-0.5">
                      {item.result.promptEn.substring(0, 40)}...
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-neon flex items-center gap-1 font-bold">
                    YÜKLE <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-void-700 bg-void-900/50">
          <button 
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            GEÇMİŞİ TEMİZLE
          </button>
        </div>

      </div>
    </>
  );
};

export default HistorySidebar;