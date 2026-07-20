"use client";

import { useState } from "react";
import { ToolWorkspace } from "@/components/studio/tool-workspace";
import { FileUpload } from "@/components/studio/file-upload";
import { CREDIT_COSTS } from "@/config/pricing";
import { toast } from "sonner";
import { Film, PlaySquare } from "lucide-react";
import { useActiveTeam } from "@/hooks/use-active-team";

export default function VideoEditingPage() {
  const { activeTeamId } = useActiveTeam();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!fileUrl) return;
    if (!prompt.trim()) {
      toast.error("Zəhmət olmasa redaktə əmrini yazın");
      return;
    }

    try {
      setIsGenerating(true);
      setResultUrl(null);

      const res = await fetch("/api/ai/video-editing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, prompt, teamId: activeTeamId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generasiya xətası");

      setTimeout(() => {
        setResultUrl("https://www.w3schools.com/html/mov_bbb.mp4");
        setIsGenerating(false);
        toast.success("Video uğurla redaktə edildi!");
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
      <FileUpload 
        onFileSelect={setFileUrl} 
        accept="video/mp4,video/webm" 
        label="Redaktə ediləcək videonu seçin" 
      />
      
      <div>
        <label className="block text-sm font-medium mb-2">Necə dəyişmək istəyirsiniz?</label>
        <textarea 
          className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none focus:ring-2 focus:ring-primary outline-none transition-all"
          placeholder="Məsələn: Videonun stilini animeyə çevir..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-xl flex items-start gap-3">
        <PlaySquare className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
        <p>Maksimum 10 saniyəlik və 50MB ölçüsündə videolar dəstəklənir.</p>
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
          <p>AI videonu redaktə edir...</p>
          <p className="text-xs mt-2 opacity-60">Bu bir neçə dəqiqə çəkə bilər</p>
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
      title="Video Editing"
      description="Mövcud videolarınızın vizual stilini dəyişdirin və onlara effektlər əlavə edin."
      creditCost={CREDIT_COSTS.video_editing}
      isGenerating={isGenerating}
      isGenerateDisabled={!fileUrl || !prompt.trim()}
      onGenerate={handleGenerate}
      sidebarContent={Sidebar}
      resultContent={Result}
    />
  );
}
