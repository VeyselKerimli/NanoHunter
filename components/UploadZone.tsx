import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import ScannerOverlay from './ScannerOverlay';

interface UploadZoneProps {
  selectedImage: File | null;
  previewUrl: string | null;
  onImageSelect: (file: File) => void;
  onClear: () => void;
  isScanning: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({ selectedImage, previewUrl, onImageSelect, onClear, isScanning }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="text-neon font-mono text-sm uppercase tracking-wider">01 // STİL VE KOMPOZİSYON KAYNAĞI</h2>
        {selectedImage && !isScanning && (
          <button 
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> İPTAL ET
          </button>
        )}
      </div>

      <div
        className={`relative w-full h-80 rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${
          previewUrl 
            ? 'border-neon/50 bg-void-800' 
            : 'border-void-700 hover:border-neon/30 bg-void-800/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* Image Container - Scanner applies ONLY here */}
            <div className="relative max-w-full max-h-full overflow-hidden rounded">
               <img 
                src={previewUrl} 
                alt="Target" 
                className="max-w-full max-h-full object-contain"
                style={isScanning ? { filter: 'contrast(1.2) brightness(0.8) sepia(1) hue-rotate(90deg)' } : {}}
              />
              
              {/* Scanner Overlay: Only visible when scanning AND constrained to image container via absolute positioning */}
              {isScanning && <ScannerOverlay />}
            </div>

            {/* Metadata Tag */}
            {!isScanning && (
              <div className="absolute bottom-4 left-4 font-mono text-xs text-neon bg-black/70 border border-neon/20 px-2 py-1 rounded backdrop-blur">
                {selectedImage?.name}
              </div>
            )}
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center h-full cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-void-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-void-600">
              <Upload className="w-8 h-8 text-gray-400 group-hover:text-neon transition-colors" />
            </div>
            <p className="text-gray-300 font-medium">Kaynak Görseli Yükle</p>
            <p className="text-gray-500 text-sm mt-2 text-center px-4">
              Stilini ve pozunu kopyalamak istediğiniz görseli buraya bırakın.
            </p>
          </div>
        )}

        {/* Corner Decorators */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon opacity-50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon opacity-50"></div>
      </div>
    </div>
  );
};

export default UploadZone;