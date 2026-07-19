import { inngest } from "../client";
import { updateGenerationStatus, getGenerationById } from "@/lib/db/queries/generations";
import { addCreditTransaction } from "@/lib/db/queries/credits";
import { createFile } from "@/lib/db/queries/files";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const generateImage = inngest.createFunction(
  { id: "generate-image", name: "Generate AI Image", triggers: [{ event: "ai/generate.image" }] },
  async ({ event, step }) => {
    const { generationId, userId, prompt, creditsCost, modelId, provider } = event.data;

    // 1. Update status to processing
    await step.run("update-status-processing", async () => {
      await updateGenerationStatus(generationId, { status: "processing" });
    });

    try {
      // 3. Router: Provayderə uyğun modeli çağır
      const aiResult = await step.run("call-ai-model", async () => {
        try {
          if (provider === "other") {
            // Pollinations AI tamamilə pulsuzdur, limitsizdir və heç bir API açarı tələb etmir
            const safePrompt = encodeURIComponent(prompt);
            const randomSeed = Math.floor(Math.random() * 1000000);
            const pollinationsUrl = `https://image.pollinations.ai/prompt/${safePrompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true&model=flux`;
            
            // Frontend-də xəta çıxmaması üçün şəkli backend-də gözləyib base64 formatına çeviririk
            const response = await fetch(pollinationsUrl, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "image/jpeg,image/png,*/*"
              }
            });
            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`Pollinations Error (${response.status}): ${errText.substring(0, 100)}`);
            }
            
            const arrayBuffer = await response.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString('base64');
            
            return { url: `data:image/jpeg;base64,${base64Image}` };
          }

          throw new Error(`Bilinməyən provayder: ${provider}`);
        } catch (e: any) {
          return { error: e.message };
        }
      });

      if (aiResult.error) {
        throw new Error(aiResult.error);
      }
      
      const outputUrl = aiResult.url!;

      // 3. Save generated file to DB (Normally upload to ImageKit first, but we skip for MVP if ImageKit keys are missing)
      const fileId = await step.run("save-file-record", async () => {
        const newFile = await createFile({
          userId: userId,
          imagekitFileId: `pollinations-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fileName: `generation-${generationId}.png`,
          url: outputUrl,
          fileType: "image",
          sizeBytes: 0,
        });
        return newFile.id;
      });

      // 4. Update status to completed
      await step.run("update-status-completed", async () => {
        await updateGenerationStatus(generationId, {
          status: "completed",
          outputFileId: fileId,
        });
      });

      return { success: true, url: outputUrl };

    } catch (error: any) {
      // 5. Handle failure: update status and refund credit
      await step.run("handle-failure", async () => {
        await updateGenerationStatus(generationId, {
          status: "failed",
          error: error.message || "Bilinməyən xəta baş verdi",
        });

        // Refund credit
        await addCreditTransaction({
          userId: userId,
          amount: creditsCost,
          balanceAfter: 0, // In MVP we handle this loosely outside the transaction
          type: "refund",
          description: "Şəkil generasiyası uğursuz oldu (Refund)",
          generationId: generationId,
        });
      });

      throw error; // Let Inngest know it failed
    }
  }
);
