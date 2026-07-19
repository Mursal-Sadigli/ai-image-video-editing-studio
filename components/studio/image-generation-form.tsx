"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Wand2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  prompt: z.string().min(3, { message: "Prompt ən az 3 simvol olmalıdır." }),
  aspectRatio: z.string(),
  modelId: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ImageGenerationForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      aspectRatio: "1:1",
      modelId: "huggingface-flux",
    },
  });

  // Gələcəkdə statusu poll etmək üçün funksiya (hazırda Inngest-dən birbaşa nəticə almaq çətindir, adətən polling və ya websocket lazımdır)
  // Lakin MVP üçün biz polling edə bilərik, yaxud qısa müddətli bir şeydirsə birbaşa göstərə bilərik.
  // Burada biz "/api/generations/[id]" yazmadıq hələ. Qoy Inngest işlədikcə status "completed" olacaq.
  
  // Şəkli əldə etmək üçün polling funksiyası
  const checkStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/generations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data.generation.status);
        if (data.generation.status === "completed" && data.fileUrl) {
          setResultUrl(data.fileUrl);
          setIsGenerating(false);
          toast.success("Şəkil uğurla yaradıldı!");
          return;
        } else if (data.generation.status === "failed") {
          setIsGenerating(false);
          toast.error("Şəkil yaradılarkən xəta baş verdi.");
          return;
        }
      }
      
      // Hələ davam edirsə 3 saniyə sonra yenidən yoxla
      if (isGenerating) {
        setTimeout(() => checkStatus(id), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsGenerating(true);
      setResultUrl(null);
      setStatus("Başladılır...");

      const response = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Bilinməyən xəta");
      }

      setGenerationId(resData.generationId);
      setStatus("Növbəyə alındı...");
      toast.success("Sorğu qəbul edildi, hazırlanır...");
      
      // Polling başlat
      checkStatus(resData.generationId);
      
    } catch (error: unknown) {
      setIsGenerating(false);
      setStatus("");
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Xəta baş verdi");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sol Panel: Parametrlər */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt (İstəyinizi təsvir edin)</Label>
              <Textarea
                id="prompt"
                placeholder="A futuristic city in cyberpunk style, neon lights, 4k..."
                className="h-32 resize-none"
                disabled={isGenerating}
                {...form.register("prompt")}
              />
              {form.formState.errors.prompt && (
                <p className="text-sm text-red-500">{form.formState.errors.prompt.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aspectRatio">Ölçü formatı</Label>
                <Select
                  disabled={isGenerating}
                  onValueChange={(val) => form.setValue("aspectRatio", val)}
                  defaultValue={form.getValues("aspectRatio")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Kvadrat)</SelectItem>
                    <SelectItem value="16:9">16:9 (Geniş)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portret)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelId">AI Modeli</Label>
                <Select
                  disabled={isGenerating}
                  onValueChange={(val) => form.setValue("modelId", val)}
                  defaultValue={form.getValues("modelId")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="huggingface-flux">Hugging Face FLUX (Free)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generasiya olunur... ({status})
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Yarat
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sağ Panel: Nəticə */}
      <div className="bg-zinc-100 dark:bg-zinc-900 rounded-xl border flex flex-col items-center justify-center p-4 min-h-[400px] lg:min-h-[600px] overflow-hidden relative">
        {resultUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resultUrl} alt="Generated" className="object-contain w-full h-full rounded-lg shadow-sm" />
        ) : isGenerating ? (
          <div className="flex flex-col items-center text-muted-foreground animate-pulse">
            <RefreshCcw className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p>Rəssam işləyir...</p>
            <span className="text-xs mt-2 opacity-70">Bu proses 10-30 saniyə çəkə bilər</span>
          </div>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground opacity-50">
            <Wand2 className="h-12 w-12 mb-4" />
            <p>Nəticə burada görünəcək</p>
          </div>
        )}
      </div>
    </div>
  );
}
