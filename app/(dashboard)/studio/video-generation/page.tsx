"use client";

import { useState } from "react";
import { ToolWorkspace } from "@/components/studio/tool-workspace";
import { FileUpload } from "@/components/studio/file-upload";
import { CREDIT_COSTS } from "@/config/pricing";
import { toast } from "sonner";
import { Film } from "lucide-react";
import { useActiveTeam } from "@/hooks/use-active-team";

export default function VideoGenerationPage() {
  const { activeTeamId } = useActiveTeam();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() && !fileUrl) {
      toast.error("Zəhmət olmasa prompt yazın və ya şəkil yükləyin");
      return;
    }

    try {
      setIsGenerating(true);
      setResultUrl(null);

      const res = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, prompt, teamId: activeTeamId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generasiya xətası");

      setTimeout(() => {
        // Mock video (Unsplash doesnt have direct mp4, using a sample video url)
        setResultUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        setIsGenerating(false);
        toast.success("Video uğurla yaradıldı!");
      }, 7000);

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
      <div>
        <label className="block text-sm font-medium mb-2">Videonu təsvir edin</label>
        <textarea 
          className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="Məsələn: Dəniz kənarında uçan qağayılar, gün batımı, kinematik görünüş..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <FileUpload onFileSelect={setFileUrl} label="və ya Başlanğıc şəkli seçin (Opsional)" />

      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl">
        💡 **İpucu:** Videonuz təxminən 5 saniyə uzunluğunda olacaq.
      </div>
    </div>
  );

  const Result = (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      {resultUrl ? (
        <video 
          src={resultUrl} 
          controls 
          autoPlay 
          loop 
          className="max-w-full max-h-[500px] rounded-lg shadow-lg" 
        />
      ) : isGenerating ? (
        <div className="flex flex-col items-center text-muted-foreground animate-pulse">
          <Film className="w-12 h-12 mb-4 opacity-50" />
          <p>AI video generasiya edir...</p>
          <p className="text-xs mt-2 opacity-60">Bu 1-3 dəqiqə çəkə bilər</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground">
          <Film className="w-12 h-12 mb-4 opacity-20" />
          <p>Nəticə burada görünəcək</p>
        </div>
      )}
    </div>
  );

  return (
    <ToolWorkspace
      title="Video Generation"
      description="Yalnız mətn və ya şəkil vasitəsilə yüksək keyfiyyətli, fotorealistik videolar yaradın."
      creditCost={CREDIT_COSTS.video_generation}
      isGenerating={isGenerating}
      isGenerateDisabled={!prompt.trim() && !fileUrl}
      onGenerate={handleGenerate}
      sidebarContent={Sidebar}
      resultContent={Result}
    />
  );
}
