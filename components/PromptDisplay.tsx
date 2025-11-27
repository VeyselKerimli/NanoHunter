
import React, { useState } from 'react';
import { Copy, Terminal, Check, Languages, Download, FileText } from 'lucide-react';
import { downloadTextFile } from '../utils';

interface Props {
  promptEn: string;
  promptTr: string;
  analysis: string;
}

const PromptDisplay: React.FC<Props> = ({ promptEn, promptTr, analysis }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAnalysis, setCopiedAnalysis] = useState(false);
  const [lang, setLang] = useState<'EN' | 'TR'>('EN');

  const activePrompt = lang === 'EN' ? promptEn : promptTr;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(analysis);
    setCopiedAnalysis(true);
    setTimeout(() => setCopiedAnalysis(false), 2000);
  };

  const handleDownload = () => {
    const content = `--- NANOHUNTER ANALYSIS REPORT ---\n\n[ANALYSIS]\n${analysis}\n\n[PROMPT (${lang})]\n${activePrompt}\n\n[GENERATED AT]\n${new Date().toLocaleString()}`;
    downloadTextFile(`nanohunter_prompt_${Date.now()}.txt`, content);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Analysis Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-neon font-mono text-sm uppercase tracking-wider flex items-center gap-2">
              <Terminal size={14} /> 04 // SİSTEM ANALİZ RAPORU
            </h2>
            <button 
              onClick={handleCopyAnalysis} 
              className="text-[10px] text-gray-500 hover:text-neon flex items-center gap-1 transition-colors"
            >
              {copiedAnalysis ? <Check size={10} /> : <Copy size={10} />}
              {copiedAnalysis ? 'KOPYALANDI' : 'ANALİZİ KOPYALA'}
            </button>
        </div>
        <div className="bg-void-800 border border-void-700 p-4 rounded-lg text-sm text-gray-300 font-mono leading-relaxed shadow-inner max-h-[150px] overflow-y-auto custom-scrollbar">
           <span className="text-neon mr-2">{'>'}</span>{analysis}
        </div>
      </div>

      {/* Prompt Result Section */}
      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-end mb-0">
           <div className="flex gap-1">
              <button 
                onClick={() => setLang('EN')}
                className={`px-4 py-2 text-xs font-bold font-mono rounded-t-lg border-t border-x transition-colors ${lang === 'EN' ? 'bg-void-800 border-neon text-neon' : 'bg-void-900 border-void-700 text-gray-500 hover:text-gray-300'}`}
              >
                ENGLISH (PRO)
              </button>
              <button 
                onClick={() => setLang('TR')}
                className={`px-4 py-2 text-xs font-bold font-mono rounded-t-lg border-t border-x transition-colors ${lang === 'TR' ? 'bg-void-800 border-neon text-neon' : 'bg-void-900 border-void-700 text-gray-500 hover:text-gray-300'}`}
              >
                TÜRKÇE
              </button>
           </div>
           
           <div className="flex gap-2 mb-2">
             <button 
                onClick={handleDownload}
                className="flex items-center gap-2 text-xs font-mono bg-void-800 hover:bg-void-700 text-gray-300 border border-void-700 px-3 py-1.5 rounded transition-all active:scale-95"
                title="TXT Olarak İndir"
              >
                <Download size={14} />
              </button>
             <button 
               onClick={handleCopyPrompt}
               className="flex items-center gap-2 text-xs font-mono bg-neon hover:bg-neon-dark text-black border border-neon px-3 py-1.5 rounded transition-all active:scale-95 font-bold shadow-[0_0_10px_rgba(0,255,157,0.2)]"
             >
               {copiedPrompt ? <Check size={14}/> : <Copy size={14} />}
               {copiedPrompt ? 'KOPYALANDI' : 'KOPYALA'}
             </button>
           </div>
        </div>

        <div className="relative flex-grow bg-void-800 border border-void-700 rounded-b-lg rounded-tr-lg p-6 group overflow-y-auto max-h-[400px] shadow-inner custom-scrollbar">
          <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
            <Languages size={48} className="text-neon" />
          </div>
          
          <p className="text-gray-200 font-serif text-lg leading-relaxed whitespace-pre-wrap relative z-10 selection:bg-neon selection:text-black">
            {activePrompt}
          </p>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 font-mono text-center">
          * Nano Banana ve Midjourney için <span className="text-neon">ENGLISH</span> versiyonu önerilir.
        </p>
      </div>
    </div>
  );
};

export default PromptDisplay;
