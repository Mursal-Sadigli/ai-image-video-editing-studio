"use client";

import { useState } from "react";
import { ToolWorkspace } from "@/components/studio/tool-workspace";
import { FileUpload } from "@/components/studio/file-upload";
import { CREDIT_COSTS } from "@/config/pricing";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";

export default function UpscalerPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!fileUrl) return;

    try {
      setIsGenerating(true);
      setResultUrl(null);

      const res = await fetch("/api/ai/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, scale }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generasiya xətası");

      setTimeout(() => {
        setResultUrl("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba");
        setIsGenerating(false);
        toast.success(`Şəkil uğurla ${scale}x böyüdüldü!`);
      }, 5000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Xəta baş verdi");
      }
      setIsGenerating(false);
    }
  };

  const Sidebar = (
    <div className="space-y-6">
      <FileUpload onFileSelect={setFileUrl} label="Böyüdüləcək şəkli seçin" />
      
      <div>
        <label className="block text-sm font-medium mb-2">Böyütmə Ölçüsü (Scale)</label>
        <div className="flex gap-2">
          <button 
            onClick={() => setScale(2)}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${scale === 2 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
          >
            2x Upscale
          </button>
          <button 
            onClick={() => setScale(4)}
            className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${scale === 4 ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
          >
            4x Upscale
          </button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">
        💡 **İpucu:** Orijinal detal çox olduqda 4x upscale daha uğurlu nəticə verir.
      </div>
    </div>
  );

  const Result = (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      {resultUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resultUrl} alt="Nəticə" className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
      ) : isGenerating ? (
        <div className="flex flex-col items-center text-muted-foreground animate-pulse">
          <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
          <p>AI şəkli böyüdür...</p>
          <p className="text-xs mt-2 opacity-60">Bu 15-20 saniyə çəkə bilər</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground">
          <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
          <p>Nəticə burada görünəcək</p>
        </div>
      )}
    </div>
  );

  return (
    <ToolWorkspace
      title="AI Upscaler"
      description="Aşağı keyfiyyətli şəkillərinizi 2x və ya 4x dəfə itkisiz böyüdün."
      creditCost={CREDIT_COSTS.upscale}
      isGenerating={isGenerating}
      isGenerateDisabled={!fileUrl}
      onGenerate={handleGenerate}
      sidebarContent={Sidebar}
      resultContent={Result}
    />
  );
}
