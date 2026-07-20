"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (fileUrl: string) => void;
  accept?: string;
  label?: string;
}

export function FileUpload({ onFileSelect, accept = "image/*", label = "Şəkil yüklə" }: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // MOCK: In a real app, you would upload to ImageKit here and pass the real URL to onFileSelect.
      // For now, we just pass a mock URL to simulate success.
      onFileSelect("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop");
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${preview ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept={accept}
          onChange={handleFileChange}
        />
        
        {preview ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden flex items-center justify-center bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 text-muted-foreground">
            <UploadCloud className="w-10 h-10 mb-3 text-primary/50" />
            <p className="text-sm font-medium">Kliklə və ya sürüklə</p>
            <p className="text-xs mt-1 opacity-70">PNG, JPG (Maks. 5MB)</p>
          </div>
        )}
      </div>
      {preview && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Başqa şəkil seçmək üçün üzərinə klikləyin
        </p>
      )}
    </div>
  );
}
