"use client";

import { useState } from "react";
import { ToolWorkspace } from "@/components/studio/tool-workspace";
import { FileUpload } from "@/components/studio/file-upload";
import { CREDIT_COSTS } from "@/config/pricing";
import { toast } from "sonner";
import { Image as ImageIcon, Eraser } from "lucide-react";

export default function ObjectRemovalPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!fileUrl) return;

    try {
      setIsGenerating(true);
      setResultUrl(null);

      const res = await fetch("/api/ai/remove-object", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, prompt: "Silindi" }), // Mock mask
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generasiya xətası");

      setTimeout(() => {
        setResultUrl("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba");
        setIsGenerating(false);
        toast.success("Obyekt uğurla silindi!");
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
      <FileUpload onFileSelect={setFileUrl} label="Şəkil seçin" />
      
      {fileUrl && (
        <div className="bg-primary/10 border border-primary text-primary text-sm p-4 rounded-xl flex items-start gap-3">
          <Eraser className="w-5 h-5 mt-0.5 shrink-0" />
          <p>
            Mükəmməl! Əslində burada fırça (brush) ilə obyekti işarələmək üçün canvas olacaq. 
            Hələlik "Generasiya et" düyməsinə basaraq testi davam etdirə bilərsiniz.
          </p>
        </div>
      )}
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
          <p>AI obyekti silir...</p>
          <p className="text-xs mt-2 opacity-60">Bu 10-15 saniyə çəkə bilər</p>
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
      title="Obyekt Silmə"
      description="Şəkildəki istənməyən obyektləri və ya insanları iz qoymadan silin."
      creditCost={CREDIT_COSTS.object_removal}
      isGenerating={isGenerating}
      isGenerateDisabled={!fileUrl}
      onGenerate={handleGenerate}
      sidebarContent={Sidebar}
      resultContent={Result}
    />
  );
}
