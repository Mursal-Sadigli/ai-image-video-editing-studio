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
          if (provider === "google") {
            const apiKey = process.env.GOOGLE_API_KEY;
            if (!apiKey) throw new Error("Server xətası: Google API açarı tapılmadı (.env.local)");
            
            // Imagen 3 üçün Gemini API (AI Studio) bağlantısı
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                instances: [{ prompt: prompt }],
                parameters: { sampleCount: 1 }
              })
            });

            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Google Gemini Error: ${response.status} ${errorData}`);
            }
            const data = await response.json();
            if (data.predictions && data.predictions.length > 0) {
              const base64Image = data.predictions[0].bytesBase64Encoded;
              return { url: `data:image/jpeg;base64,${base64Image}` };
            }
            throw new Error("Invalid output from Google Gemini");
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
