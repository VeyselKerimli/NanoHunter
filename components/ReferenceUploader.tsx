import React, { useRef } from 'react';
import { UserPlus, X, RefreshCw } from 'lucide-react';

interface Props {
  selectedFile: File | null;
  onSelect: (file: File) => void;
  onClear: () => void;
}

const ReferenceUploader: React.FC<Props> = ({ selectedFile, onSelect, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  return (
    <div className="mt-3 animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-neon font-mono flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse"></div>
          REFERANS YÜZ KAYNAĞI
        </span>
        {selectedFile && (
           <button onClick={onClear} className="text-[10px] text-red-400 hover:text-white flex items-center gap-1">
             <X size={10} /> KALDIR
           </button>
        )}
      </div>
      
      <div 
        onClick={() => inputRef.current?.click()}
        className={`
          relative h-24 border border-dashed rounded-lg flex items-center justify-center cursor-pointer overflow-hidden group transition-all
          ${selectedFile ? 'border-neon/50 bg-black' : 'border-void-700 bg-void-800 hover:border-neon/30'}
        `}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
        />

        {previewUrl ? (
          <div className="flex items-center gap-4 w-full px-4">
             <img src={previewUrl} className="h-20 w-20 object-cover rounded border border-void-700" alt="Ref Face" />
             <div className="flex flex-col">
                <span className="text-xs text-white font-mono truncate max-w-[150px]">{selectedFile?.name}</span>
                <span className="text-[10px] text-neon flex items-center gap-1 mt-1">
                  <RefreshCw size={10} className="animate-spin" /> Hedef Yüz
                </span>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 group-hover:text-neon transition-colors">
            <UserPlus size={20} className="mb-1" />
            <span className="text-[10px] font-mono uppercase">Yüz Fotoğrafı Seç</span>
          </div>
        )}
      </div>
      <p className="text-[10px] text-gray-500 mt-1 ml-1">
        * Stil görselindeki yüz yerine bu fotoğraf kullanılacaktır.
      </p>
    </div>
  );
};

export default ReferenceUploader;