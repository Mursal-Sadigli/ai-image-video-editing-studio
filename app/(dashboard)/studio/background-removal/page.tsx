"use client";

import { useState } from "react";
import { ToolWorkspace } from "@/components/studio/tool-workspace";
import { FileUpload } from "@/components/studio/file-upload";
import { CREDIT_COSTS } from "@/config/pricing";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";

export default function BackgroundRemovalPage() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!fileUrl) return;

    try {
      setIsGenerating(true);
      setResultUrl(null);

      // Mock API zəngi
      const res = await fetch("/api/ai/remove-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generasiya xətası");

      // Mock olaraq 5 saniyə gözləyirik (Inngest emulyasiyası UI-da göstərmək üçün)
      // Əsl məhsulda Polling edib status=completed olanda nəticəni göstəririk
      setTimeout(() => {
        setResultUrl("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba"); // Mock nəticə
        setIsGenerating(false);
        toast.success("Arxa fon uğurla silindi!");
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
      <FileUpload onFileSelect={setFileUrl} label="Şəkil seçin (İnsan və ya obyekt)" />
      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">
        💡 **İpucu:** Daha yaxşı nəticə əldə etmək üçün kənarları dəqiq olan obyektlərin şəkillərini yükləyin.
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
          <p>AI arxa fonu silir...</p>
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
      title="Arxa Fon Silmə"
      description="İstənilən şəkildəki arxa fonu bir neçə saniyəyə şəffaf (PNG) hala gətirin."
      creditCost={CREDIT_COSTS.background_removal}
      isGenerating={isGenerating}
      isGenerateDisabled={!fileUrl}
      onGenerate={handleGenerate}
      sidebarContent={Sidebar}
      resultContent={Result}
    />
  );
}
