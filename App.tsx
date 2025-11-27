
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import PreservationControls from './components/PreservationControls';
import PromptDisplay from './components/PromptDisplay';
import RatioSelector from './components/RatioSelector';
import HistorySidebar from './components/HistorySidebar';
import { PreservationOptions, AnalysisResult, LoadingState, AspectRatio, HistoryItem, SubjectType } from './types';
import { generateNanoPrompt } from './services/geminiService';
import { ArrowRight, Loader2, AlertCircle, Sparkles, Ban } from 'lucide-react';

const App: React.FC = () => {
  // Main State
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // New: Subject Type State
  const [subjectType, setSubjectType] = useState<SubjectType>('HUMAN');

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Expanded Preservation Options Initialization
  const [preservation, setPreservation] = useState<PreservationOptions>({
    // Shared
    background: false, lighting: false, colors: false, cameraAngle: false,
    artStyle: false, mood: false, time: false, weather: false,
    
    // Human
    face: true, hairStyle: true, hairColor: true, eyeColor: false,
    gaze: true, skinTexture: false, makeup: false, bodyType: true, 
    pose: true, clothes: false, accessories: false, hands: false, age: false,

    // Object
    material: false, texture: false, geometry: false, reflections: false,
    transparency: false, wearAndTear: false, typography: false, 
    branding: false, pattern: false, architecture: false, nature: false, 
    perspective: false,

    // Technical
    depthOfField: false, lens: false, shutterSpeed: false, filmGrain: false,
    contrast: false, era: false, props: false
  });

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('nanohunter_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleStyleImageSelect = (selectedFile: File) => {
    if (selectedFile.size > 20 * 1024 * 1024) {
        setError("Görsel boyutu çok büyük (Max 20MB).");
        return;
    }
    setStyleFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setResult(null);
    setError(null);
  };

  const handleClearAll = () => {
    setStyleFile(null);
    setReferenceFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setUserPrompt('');
    setNegativePrompt('');
  };

  const togglePreservation = (key: keyof PreservationOptions) => {
    setPreservation(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const handleSetPreset = (newOptions: Partial<PreservationOptions>) => {
      setPreservation(prev => ({ ...prev, ...newOptions }));
  };

  const addToHistory = (res: AnalysisResult, fileName: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageName: fileName,
      result: res,
      aspectRatio: aspectRatio,
      subjectType: subjectType
    };
    
    const updatedHistory = [newItem, ...history].slice(0, 20); 
    setHistory(updatedHistory);
    localStorage.setItem('nanohunter_history', JSON.stringify(updatedHistory));
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setResult(item.result);
    setAspectRatio(item.aspectRatio);
    setSubjectType(item.subjectType || 'HUMAN');
    setHistoryOpen(false);
    setError("Not: Geçmişten veri yüklendi (Kaynak görsel hariç).");
    setTimeout(() => setError(null), 4000);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('nanohunter_history');
  };

  const handleGenerate = async () => {
    if (!styleFile) return;

    setLoadingState(LoadingState.ANALYZING);
    setError(null);

    try {
      const response = await generateNanoPrompt(
          styleFile, 
          referenceFile, 
          preservation, 
          aspectRatio, 
          subjectType,
          userPrompt, 
          negativePrompt
      );
      setResult(response);
      addToHistory(response, styleFile.name);
      setLoadingState(LoadingState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sistem hatası.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-200 selection:bg-neon selection:text-black bg-[#050505]">
      <Header onHistoryClick={() => setHistoryOpen(true)} />

      <HistorySidebar 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreHistory}
        onClearHistory={handleClearHistory}
      />

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-void-900 border border-void-700 p-6 rounded-2xl shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center">
                   <div className="w-24 h-24 border border-white/20 rounded-full"></div>
                 </div>
              </div>

              <UploadZone 
                selectedImage={styleFile} 
                previewUrl={previewUrl} 
                onImageSelect={handleStyleImageSelect}
                onClear={handleClearAll}
                isScanning={loadingState === LoadingState.ANALYZING}
              />
              
              <PreservationControls 
                options={preservation}
                onChange={togglePreservation}
                referenceFile={referenceFile}
                onReferenceSelect={setReferenceFile}
                onReferenceClear={() => setReferenceFile(null)}
                onSetPreset={handleSetPreset}
                subjectType={subjectType}
                onSubjectTypeChange={setSubjectType}
              />

              <RatioSelector 
                selected={aspectRatio}
                onChange={setAspectRatio}
              />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <div>
                  <h2 className="text-neon font-mono text-sm uppercase tracking-wider mb-2">04 // EKSTRA DETAYLAR</h2>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="Örn: 'Mavi neon ışıklar ekle'..."
                    className="w-full h-24 bg-void-800 border border-void-700 rounded-lg p-3 text-xs text-gray-200 placeholder-gray-600 focus:border-neon focus:ring-1 focus:ring-neon transition-all resize-none font-mono cyber-input"
                  />
                </div>
                <div>
                  <h2 className="text-red-400 font-mono text-sm uppercase tracking-wider mb-2 flex items-center gap-1">
                     <Ban size={14} /> 05 // NEGATİF PROMPT
                  </h2>
                  <textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="İstenmeyen: 'Bulanık', 'Yazı'..."
                    className="w-full h-24 bg-void-800 border border-red-900/50 rounded-lg p-3 text-xs text-gray-200 placeholder-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none font-mono cyber-input"
                  />
                </div>
              </div>

              <div className="mt-6 relative z-10">
                <button
                  onClick={handleGenerate}
                  disabled={!styleFile || loadingState === LoadingState.ANALYZING}
                  className={`
                    w-full py-4 rounded-lg font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden
                    ${!styleFile || loadingState === LoadingState.ANALYZING
                      ? 'bg-void-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-neon hover:bg-neon-dark text-black shadow-[0_0_20px_rgba(0,255,157,0.3)] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)]'}
                  `}
                >
                  {loadingState === LoadingState.ANALYZING ? (
                    <>
                      <Loader2 className="animate-spin" /> SİSTEM İŞLENİYOR...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 group-hover:animate-pulse flex items-center gap-2">
                        PROMPTU OLUŞTUR <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </>
                  )}
                </button>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-800 text-red-400 text-sm rounded flex items-center gap-2 animate-in slide-in-from-bottom-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full bg-void-900 border border-void-700 p-6 rounded-2xl shadow-xl relative min-h-[500px] flex flex-col backdrop-blur-sm">
              
              {loadingState === LoadingState.ANALYZING && (
                <div className="absolute inset-0 z-10 bg-void-900/90 backdrop-blur flex flex-col items-center justify-center rounded-2xl text-center p-6">
                   <div className="w-24 h-24 relative mb-6">
                      <div className="absolute inset-0 border-2 border-void-700 rounded-full"></div>
                      <div className="absolute inset-0 border-t-2 border-neon rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-b-2 border-neon/50 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
                      <div className="absolute inset-8 bg-neon/20 rounded-full animate-pulse"></div>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2 tracking-widest">SİSTEM İŞLENİYOR</h3>
                   <p className="text-neon font-mono text-xs animate-pulse">
                     {subjectType === 'HUMAN' ? 'BİYOMETRİK ANALİZ' : 'YÜZEY & GEOMETRİ ANALİZİ'} AKTİF<br/>
                     PROTOKOLLER: OPTİMİZE EDİLİYOR...
                   </p>
                </div>
              )}

              {result ? (
                <PromptDisplay promptEn={result.promptEn} promptTr={result.promptTr} analysis={result.analysis} />
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-600 space-y-6">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-neon/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <Sparkles size={64} className="text-void-600 relative z-10 group-hover:text-neon/50 transition-colors" />
                  </div>
                  <div className="text-center px-6">
                    <h3 className="text-lg font-mono text-gray-400 mb-2">BEKLEME MODU</h3>
                    <div className="text-sm text-gray-500 space-y-2 text-left inline-block border-l-2 border-void-700 pl-4 py-2">
                      <p>1. <span className="text-neon">Görsel</span> yükle.</p>
                      <p>2. <span className="text-neon">Tür</span> seç (İnsan / Nesne).</p>
                      <p>3. Protokolleri ayarla.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
