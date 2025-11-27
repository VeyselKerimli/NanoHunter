import React, { useState, useEffect } from 'react';
import { 
  User, Shirt, Scan, Image, Lock, LockOpen, Sun, Palette, Camera, 
  BoxSelect, Aperture, Brush, Contrast, Smile, Clock, Cloud, Eye, Hourglass,
  Sparkles, UserCheck, Eye as EyeIcon, Glasses, Leaf, Zap, Layers, Framer,
  Scissors, Building, Activity, Film, CheckCircle2, RotateCcw,
  Cuboid, Droplets, Type, Fingerprint, Mountain, Shapes, Box, Component
} from 'lucide-react';
import { PreservationOptions, SubjectType } from '../types';
import ReferenceUploader from './ReferenceUploader';

interface Props {
  options: PreservationOptions;
  onChange: (key: keyof PreservationOptions) => void;
  referenceFile: File | null;
  onReferenceSelect: (file: File) => void;
  onReferenceClear: () => void;
  onSetPreset: (preset: Partial<PreservationOptions>) => void;
  subjectType: SubjectType;
  onSubjectTypeChange: (type: SubjectType) => void;
}

const PreservationControls: React.FC<Props> = ({ 
  options, 
  onChange,
  referenceFile,
  onReferenceSelect,
  onReferenceClear,
  onSetPreset,
  subjectType,
  onSubjectTypeChange
}) => {
  
  const [activeTab, setActiveTab] = useState<string>('character');

  // Reset tab when subject type changes
  useEffect(() => {
    setActiveTab(subjectType === 'HUMAN' ? 'character' : 'structure');
  }, [subjectType]);

  const handlePreset = (type: 'DEFAULT' | 'MAX' | 'RESET') => {
    let newOptions: Partial<PreservationOptions> = {};
    
    if (type === 'RESET') {
        Object.keys(options).forEach(key => { newOptions[key as keyof PreservationOptions] = false; });
        if (subjectType === 'HUMAN') newOptions.face = true;
    } else if (type === 'MAX') {
        Object.keys(options).forEach(key => { newOptions[key as keyof PreservationOptions] = true; });
    } else if (type === 'DEFAULT') {
        if (subjectType === 'HUMAN') {
            newOptions = { face: true, hairStyle: true, skinTexture: true, pose: true, lighting: true };
        } else {
            newOptions = { material: true, geometry: true, texture: true, lighting: true, perspective: true };
        }
    }
    onSetPreset(newOptions);
  };

  // --- CONFIGURATION FOR HUMAN MODE ---
  const humanGroups = {
    character: {
      label: 'KARAKTER',
      icon: User,
      items: [
        { key: 'face', label: 'YÜZ KİMLİĞİ', icon: UserCheck, desc: 'Biyometrik Kimlik' },
        { key: 'pose', label: 'POZ', icon: Scan, desc: 'Vücut Duruşu' },
        { key: 'hairStyle', label: 'SAÇ ŞEKLİ', icon: Scissors, desc: 'Kesim Tarzı' },
        { key: 'hairColor', label: 'SAÇ RENGİ', icon: Palette, desc: 'Boya Tonu' },
        { key: 'eyeColor', label: 'GÖZ RENGİ', icon: EyeIcon, desc: 'İris Rengi' },
        { key: 'gaze', label: 'BAKIŞ', icon: Eye, desc: 'Bakış Yönü' },
        { key: 'skinTexture', label: 'CİLT', icon: Activity, desc: 'Doku & Detay' },
        { key: 'hands', label: 'ELLER', icon: Fingerprint, desc: 'El & Parmak' },
        { key: 'bodyType', label: 'VÜCUT', icon: User, desc: 'Fiziksel Yapı' },
        { key: 'age', label: 'YAŞ', icon: Hourglass, desc: 'Görünür Yaş' },
      ]
    },
    style: {
      label: 'STİL',
      icon: Shirt,
      items: [
        { key: 'clothes', label: 'KIYAFET', icon: Shirt, desc: 'Kombin Detayı' },
        { key: 'accessories', label: 'AKSESUAR', icon: Glasses, desc: 'Takı & Gözlük' },
        { key: 'makeup', label: 'MAKYAJ', icon: Sparkles, desc: 'Kozmetik Stil' },
      ]
    },
    env: {
      label: 'ORTAM',
      icon: Image,
      items: [
        { key: 'background', label: 'ARKAPLAN', icon: Image, desc: 'Genel Mekan' },
        { key: 'nature', label: 'DOĞA', icon: Leaf, desc: 'Bitki & Su' },
        { key: 'time', label: 'ZAMAN', icon: Clock, desc: 'Günün Saati' },
        { key: 'weather', label: 'HAVA', icon: Cloud, desc: 'Hava Durumu' },
      ]
    }
  };

  // --- CONFIGURATION FOR OBJECT MODE ---
  const objectGroups = {
    structure: {
      label: 'YAPI & FORM',
      icon: Cuboid,
      items: [
        { key: 'geometry', label: 'GEOMETRİ', icon: Shapes, desc: 'Form & Silüet' },
        { key: 'perspective', label: 'PERSPEKTİF', icon: Component, desc: 'Kaçış Noktası' },
        { key: 'architecture', label: 'MİMARİ', icon: Building, desc: 'Yapısal Stil' },
        { key: 'pattern', label: 'DESEN', icon: Box, desc: 'Tekrar Eden Motif' },
        { key: 'nature', label: 'MANZARA', icon: Mountain, desc: 'Arazi & Bitki' },
      ]
    },
    material: {
      label: 'MALZEME',
      icon: Layers,
      items: [
        { key: 'material', label: 'MATERYAL', icon: BoxSelect, desc: 'Ahşap, Metal vb.' },
        { key: 'texture', label: 'DOKU', icon: Activity, desc: 'Yüzey Pürüzü' },
        { key: 'reflections', label: 'YANSIMA', icon: Sparkles, desc: 'Işık Kırılması' },
        { key: 'transparency', label: 'ŞEFFAFLIK', icon: Droplets, desc: 'Cam/Sıvı Etkisi' },
        { key: 'wearAndTear', label: 'ESKİME', icon: Scissors, desc: 'Kir, Pas, Çizik' },
      ]
    },
    content: {
      label: 'İÇERİK',
      icon: Type,
      items: [
        { key: 'typography', label: 'YAZI', icon: Type, desc: 'Font & Metin' },
        { key: 'branding', label: 'MARKA', icon: CheckCircle2, desc: 'Logo & Ambalaj' },
        { key: 'props', label: 'OBJELER', icon: Box, desc: 'Sahne Eşyaları' },
        { key: 'background', label: 'ARKAPLAN', icon: Image, desc: 'Çevre' },
      ]
    }
  };

  // --- SHARED TECHNICAL GROUP ---
  const technicalGroup = {
      label: 'TEKNİK',
      icon: Camera,
      items: [
        { key: 'lighting', label: 'IŞIK', icon: Sun, desc: 'Aydınlatma' },
        { key: 'colors', label: 'RENKLER', icon: Palette, desc: 'Renk Paleti' },
        { key: 'cameraAngle', label: 'AÇI', icon: Framer, desc: 'Kamera Açısı' },
        { key: 'depthOfField', label: 'ODAK', icon: Aperture, desc: 'Alan Derinliği' },
        { key: 'lens', label: 'LENS', icon: Camera, desc: 'Lens Tipi' },
        { key: 'shutterSpeed', label: 'ENSTANTANE', icon: Zap, desc: 'Hız/Blur' },
        { key: 'filmGrain', label: 'GREN', icon: Film, desc: 'Film Dokusu' },
        { key: 'contrast', label: 'KONTRAST', icon: Contrast, desc: 'Ton Farkı' },
        { key: 'artStyle', label: 'SANAT', icon: Brush, desc: 'Çizim Tarzı' },
        { key: 'mood', label: 'RUH HALİ', icon: Smile, desc: 'Atmosfer' },
        { key: 'era', label: 'DÖNEM', icon: Hourglass, desc: 'Zaman Ruhu' },
      ]
  };

  const currentGroups = subjectType === 'HUMAN' 
    ? { ...humanGroups, tech: technicalGroup }
    : { ...objectGroups, tech: technicalGroup };

  // Safety check: ensure activeTab points to a valid group, fallback to first key if not
  const activeGroup = (currentGroups as any)[activeTab] || Object.values(currentGroups)[0];

  return (
    <div className="w-full mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
         <h2 className="text-neon font-mono text-sm uppercase tracking-wider">02 // GÖRSEL TÜRÜ & PROTOKOLLER</h2>
         
         {/* Subject Type Toggle */}
         <div className="flex bg-void-800 p-1 rounded-lg border border-void-700">
            <button
              onClick={() => onSubjectTypeChange('HUMAN')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${subjectType === 'HUMAN' ? 'bg-neon text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <User size={14} /> İNSAN / PORTRE
            </button>
            <button
              onClick={() => onSubjectTypeChange('OBJECT')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${subjectType === 'OBJECT' ? 'bg-neon text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Box size={14} /> NESNE / MANZARA
            </button>
         </div>
      </div>
      
      {/* Presets & Tabs Toolbar */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center pb-2 border-b border-void-700">
             {/* Tabs */}
             <div className="flex overflow-x-auto no-scrollbar gap-1">
                {Object.entries(currentGroups).map(([key, group]) => {
                const isActive = activeTab === key || (!Object.keys(currentGroups).includes(activeTab) && key === Object.keys(currentGroups)[0]);
                const Icon = group.icon;
                return (
                    <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`
                        flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs font-mono font-bold rounded transition-all whitespace-nowrap
                        ${isActive 
                        ? 'bg-void-700 text-neon border border-void-600' 
                        : 'text-gray-500 hover:text-gray-300 hover:bg-void-800'}
                    `}
                    >
                    <Icon size={12} />
                    {group.label}
                    </button>
                )
                })}
            </div>

            {/* Actions */}
            <div className="flex gap-1 pl-2">
                <button onClick={() => handlePreset('DEFAULT')} className="text-[10px] bg-void-800 border border-void-700 hover:border-neon/30 text-gray-400 hover:text-white px-2 py-1 rounded" title="Varsayılan">
                    AUTO
                </button>
                <button onClick={() => handlePreset('MAX')} className="text-[10px] bg-void-800 border border-void-700 hover:border-neon/30 text-gray-400 hover:text-white px-2 py-1 rounded" title="Tümünü Seç">
                    ALL
                </button>
                <button onClick={() => handlePreset('RESET')} className="text-[10px] bg-void-800 border border-void-700 hover:border-red-500/30 text-gray-400 hover:text-red-400 px-2 py-1 rounded" title="Sıfırla">
                    <RotateCcw size={12} />
                </button>
            </div>
        </div>
      </div>

      {/* Active Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4 animate-in fade-in zoom-in-95 duration-200">
        {activeGroup.items.map((item: any) => {
          const isActive = options[item.key as keyof PreservationOptions];
          const Icon = item.icon;
          
          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key as keyof PreservationOptions)}
              className={`
                relative w-full group flex flex-row items-center p-2 rounded border transition-all duration-200 text-left overflow-hidden
                ${isActive 
                  ? 'border-neon bg-neon/10 text-white shadow-[inset_0_0_10px_rgba(0,255,157,0.05)]'
                  : 'border-void-700 bg-void-800 text-gray-500 hover:border-gray-500 hover:text-gray-300'}
              `}
            >
              <div className={`p-1.5 rounded-full mr-2 flex-shrink-0 transition-colors ${isActive ? 'bg-neon text-black' : 'bg-void-700 text-gray-600'}`}>
                  <Icon size={12} />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold tracking-wider truncate">{item.label}</span>
                  {isActive && <Lock size={8} className="text-neon ml-1 flex-shrink-0 animate-pulse" />}
                </div>
                <p className="text-[8px] leading-tight truncate text-gray-500 opacity-80">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Specific Logic for Human Mode: Reference Uploader */}
      {subjectType === 'HUMAN' && (
          <div className="min-h-[80px]">
            {!options.face ? (
            <div className="p-3 bg-void-800/30 border-l-2 border-neon/50 rounded-r animate-in fade-in">
                {!referenceFile && (
                <div className="mb-2 text-[10px] text-neon/80 font-mono bg-neon/5 p-2 rounded flex items-center gap-2">
                    <UserCheck size={12} />
                    <span>MOD: SOFT PRESERVE. Orijinal yüz hatları korunacak (Strict ID kapalı).</span>
                </div>
                )}
                <ReferenceUploader 
                selectedFile={referenceFile}
                onSelect={onReferenceSelect}
                onClear={onReferenceClear}
                />
            </div>
            ) : (
            <div className="p-3 bg-neon/5 border-l-2 border-neon rounded-r flex items-center gap-3 animate-in fade-in">
                <div className="bg-neon/20 p-2 rounded-full"><UserCheck size={16} className="text-neon" /></div>
                <div>
                <h4 className="text-neon font-bold text-xs font-mono">KİMLİK KORUMA: AKTİF</h4>
                <p className="text-gray-400 text-[10px]">Görseldeki kişi biyometrik olarak korunacak.</p>
                </div>
            </div>
            )}
        </div>
      )}
      
      {/* Specific Logic for Object Mode: Info Banner */}
      {subjectType === 'OBJECT' && (
          <div className="p-3 bg-blue-900/10 border-l-2 border-blue-400/50 rounded-r animate-in fade-in flex items-center gap-3">
              <div className="bg-blue-400/20 p-2 rounded-full"><Cuboid size={16} className="text-blue-400" /></div>
              <div>
                <h4 className="text-blue-400 font-bold text-xs font-mono">NESNE & MANZARA MODU</h4>
                <p className="text-gray-400 text-[10px]">Sistem yüz aramaz. Doku, malzeme ve geometriye odaklanır.</p>
              </div>
          </div>
      )}

    </div>
  );
};

export default PreservationControls;