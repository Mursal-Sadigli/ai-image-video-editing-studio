"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { AI_MODELS } from "@/lib/ai/models";
import { useActiveTeam } from "@/hooks/use-active-team";

export default function ImageGenerationPage() {
  const { isLoaded, userId } = useAuth();
  const { activeTeamId } = useActiveTeam();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [style, setStyle] = useState("photorealistic");
  const [modelId, setModelId] = useState(AI_MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Mvp version: We don't poll the DB yet, we just simulate the UI wait, 
  // but actually Inngest works in background. To make UI reactive without polling for now, 
  // we could just show "Generating..." and wait. Since it's a real background job, 
  // we normally need polling. For MVP, let's just do a 5-10 second timeout simulation 
  // or a basic polling. Let's add basic polling.

  const pollGeneration = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/status/${id}`);
      const data = await res.json();
      
      if (data.status === "completed") {
        setResultUrl(data.outputUrl);
        setIsLoading(false);
      } else if (data.status === "failed") {
        setError(data.error || "Generasiya zamanı xəta baş verdi");
        setIsLoading(false);
      } else {
        // Still processing, poll again in 2 seconds
        setTimeout(() => pollGeneration(id), 2000);
      }
    } catch (e) {
      console.error(e);
      setTimeout(() => pollGeneration(id), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResultUrl(null);
    setGenerationId(null);

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio, style, modelId, teamId: activeTeamId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Xəta baş verdi");
      }

      setGenerationId(data.generationId);
      // Start polling
      pollGeneration(data.generationId);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Şəkil Generasiyası</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel: Tənzimləmələr */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parametrlər</CardTitle>
              <CardDescription>Şəklin görünüşünü fərdiləşdirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt (Təsvir)</Label>
                <Textarea 
                  id="prompt" 
                  placeholder="Məsələn: Gələcək şəhərdə yağan yağış, neon işıqları..." 
                  className="min-h-[120px] resize-none"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Süni İntellekt Modeli</Label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger className="h-auto">
                    <SelectValue placeholder="Model seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id} className="py-2.5">
                        <div className="flex flex-col text-left gap-0.5">
                          <span className="font-medium text-sm">{model.name}</span>
                          <span className="text-[10px] text-muted-foreground whitespace-normal leading-snug">
                            {model.description} ({model.creditsCost} kredit)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format (Aspect Ratio)</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Kvadrat)</SelectItem>
                    <SelectItem value="16:9">16:9 (Geniş ekran)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portret/Reels)</SelectItem>
                    <SelectItem value="4:3">4:3 (Klassik)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Stil (Style)</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stil seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photorealistic">Fotorealistik (Tövsiyə olunur)</SelectItem>
                    <SelectItem value="cinematic">Sinematik</SelectItem>
                    <SelectItem value="anime">Anime / Manga</SelectItem>
                    <SelectItem value="3d_render">3D Render (Unreal Engine)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerate} 
                disabled={!prompt.trim() || isLoading} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Hazırlanır...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate (1 Kredit)
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Xəta</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Sağ Panel: Nəticə */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>Nəticə</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center bg-muted/30 rounded-md m-6 border border-dashed">
              {isLoading && !resultUrl ? (
                <div className="flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <p className="animate-pulse">Şəkil yaradılır, gözləyin...</p>
                </div>
              ) : resultUrl ? (
                <div className="relative w-full h-full min-h-[400px] rounded-md overflow-hidden group">
                  <img 
                    src={resultUrl} 
                    alt="Generated output" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ImageIcon className="h-16 w-16 opacity-20" />
                  <p>Generasiya edilmiş şəkil burada görünəcək</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
