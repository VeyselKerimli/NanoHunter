
export type SubjectType = 'HUMAN' | 'OBJECT';

export interface PreservationOptions {
  // --- ORTAK (SHARED) ---
  background: boolean;    
  lighting: boolean;      
  colors: boolean;        
  cameraAngle: boolean;   
  artStyle: boolean;      
  mood: boolean;          
  time: boolean;          
  weather: boolean;       

  // --- İNSAN ODAKLI (HUMAN SPECIFIC) ---
  face: boolean;          // Yüz Kimliği
  hairStyle: boolean;     // Saç Şekli
  hairColor: boolean;     // Saç Rengi
  eyeColor: boolean;      // Göz Rengi
  gaze: boolean;          // Bakış Yönü
  skinTexture: boolean;   // Cilt Dokusu
  makeup: boolean;        // Makyaj
  bodyType: boolean;      // Vücut Tipi
  pose: boolean;          // Poz
  clothes: boolean;       // Kıyafet
  accessories: boolean;   // Aksesuarlar
  hands: boolean;         // El/Parmak Detayları (YENİ)
  age: boolean;           // Yaş/Olgunluk (YENİ)

  // --- NESNE/MANZARA ODAKLI (OBJECT SPECIFIC) ---
  material: boolean;      // Malzeme (Ahşap, Metal, Plastik)
  texture: boolean;       // Yüzey Dokusu (Pürüzlü, Parlak)
  geometry: boolean;      // Geometrik Yapı / Form
  reflections: boolean;   // Yansıma / Refraksiyon
  transparency: boolean;  // Şeffaf/Opaklık
  wearAndTear: boolean;   // Eskime / Yıpranma / Kir
  typography: boolean;    // Yazı / Font Karakteri
  branding: boolean;      // Logo / Marka Öğeleri
  pattern: boolean;       // Desen / Tekrar Eden Motif
  architecture: boolean;  // Mimari Yapı
  nature: boolean;        // Bitki Örtüsü / Arazi
  perspective: boolean;   // Kaçış Noktası / Perspektif

  // --- TEKNİK (SHARED TECHNICAL) ---
  depthOfField: boolean;  
  lens: boolean;          
  shutterSpeed: boolean;  
  filmGrain: boolean;     
  contrast: boolean;      
  era: boolean;           
  props: boolean;         
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '21:9';

export interface AnalysisResult {
  promptEn: string;
  promptTr: string;
  analysis: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageName: string;
  result: AnalysisResult;
  aspectRatio: AspectRatio;
  subjectType: SubjectType;
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
