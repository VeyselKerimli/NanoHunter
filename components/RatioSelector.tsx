import React from 'react';
import { AspectRatio } from '../types';
import { Smartphone, Monitor, Square, Maximize, RectangleHorizontal } from 'lucide-react';

interface Props {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const ratios: { value: AspectRatio; label: string; icon: any; desc: string }[] = [
  { value: '1:1', label: 'KARE', icon: Square, desc: 'Sosyal Medya' },
  { value: '16:9', label: 'SİNEMATİK', icon: Monitor, desc: 'Yatay Video' },
  { value: '9:16', label: 'MOBİL', icon: Smartphone, desc: 'Hikayeler/Reels' },
  { value: '4:3', label: 'KLASİK', icon: Maximize, desc: 'Fotoğraf' },
  { value: '21:9', label: 'ULTRA GENİŞ', icon: RectangleHorizontal, desc: 'Film' },
];

const RatioSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="w-full mt-6">
      <h2 className="text-neon font-mono text-sm uppercase tracking-wider mb-3">03 // BOYUT FORMATI</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {ratios.map((item) => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`
              flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200
              ${selected === item.value 
                ? 'border-neon bg-neon/10 text-neon shadow-[0_0_10px_rgba(0,255,157,0.1)]' 
                : 'border-void-700 bg-void-800 text-gray-500 hover:border-gray-500 hover:text-gray-300'}
            `}
          >
            <item.icon size={20} className="mb-2" />
            <span className="font-mono text-xs font-bold">{item.value}</span>
            <span className="text-[10px] opacity-70">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatioSelector;