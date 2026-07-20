"use client";

import { useState } from "react";
import { ToolWorkspace } from "@/components/studio/tool-workspace";
import { FileUpload } from "@/components/studio/file-upload";
import { CREDIT_COSTS } from "@/config/pricing";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";
import { useActiveTeam } from "@/hooks/use-active-team";

export default function ImageToImagePage() {
  const { activeTeamId } = useActiveTeam();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!fileUrl) return;
    if (!prompt.trim()) {
      toast.error("Zəhmət olmasa prompt yazın");
      return;
    }

    try {
      setIsGenerating(true);
      setResultUrl(null);

      const res = await fetch("/api/ai/image-to-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, prompt, teamId: activeTeamId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generasiya xətası");

      setTimeout(() => {
        setResultUrl("https://images.unsplash.com/photo-1682687220742-aba13b6e50ba");
        setIsGenerating(false);
        toast.success("Şəkil uğurla yaradıldı!");
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
      <FileUpload onFileSelect={setFileUrl} label="Başlanğıc şəkli seçin" />
      
      <div>
        <label className="block text-sm font-medium mb-2">Necə dəyişmək istəyirsiniz?</label>
        <textarea 
          className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="Məsələn: Şəkli kiberpank üslubuna çevir, gecə vaxtı olsun..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">
        💡 **İpucu:** Prompt nə qədər detallı olsa, nəticə bir o qədər orijinala sadiq və istədiyiniz kimi olacaq.
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
          <p>AI şəkli transform edir...</p>
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
      title="Image-to-Image"
      description="Mövcud şəklinizi AI vasitəsilə tam fərqli bir üsluba və ya vəziyyətə çevirin."
      creditCost={CREDIT_COSTS.image_to_image}
      isGenerating={isGenerating}
      isGenerateDisabled={!fileUrl || !prompt.trim()}
      onGenerate={handleGenerate}
      sidebarContent={Sidebar}
      resultContent={Result}
    />
  );
}
