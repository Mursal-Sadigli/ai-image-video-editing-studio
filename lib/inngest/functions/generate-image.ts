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
      // 2. BYOK: Get user's Keys
      const userRecord = await step.run("get-user-keys", async () => {
        const result = await db.query.users.findFirst({
          where: eq(users.id, userId),
        });
        if (!result) throw new Error("User not found");
        return result;
      });

      // 3. Router: Provayderə uyğun modeli çağır
      const outputUrl = await step.run("call-ai-model", async () => {
        if (provider === "fal") {
          if (!userRecord.falApiKey) throw new Error("BYOK: Şəkil yaratmaq üçün zəhmət olmasa Settings bölməsindən Fal.ai API açarınızı daxil edin.");
          
          const response = await fetch(`https://fal.run/${modelId}`, {
            method: "POST",
            headers: {
              "Authorization": `Key ${userRecord.falApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt, image_size: "square_hd" })
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Fal.ai Error: ${response.status} ${errorData}`);
          }
          const data = await response.json();
          if (data.images && data.images.length > 0) return data.images[0].url as string;
          throw new Error("Invalid output from Fal.ai");

        } else if (provider === "openai") {
          if (!userRecord.openaiApiKey) throw new Error("BYOK: Zəhmət olmasa Settings bölməsindən OpenAI API açarınızı daxil edin.");
          
          const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${userRecord.openaiApiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ model: "dall-e-3", prompt, size: "1024x1024", n: 1 })
          });

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`OpenAI Error: ${response.status} ${errorData}`);
          }
          const data = await response.json();
          if (data.data && data.data.length > 0) return data.data[0].url as string;
          throw new Error("Invalid output from OpenAI");

        } else if (provider === "google") {
          // Google Gemini implementation (Mock/Placeholder for now as actual Imagen API requires Vertex AI specific setup)
          if (!userRecord.googleApiKey) throw new Error("BYOK: Zəhmət olmasa Settings bölməsindən Google Gemini API açarınızı daxil edin.");
          throw new Error("Google Imagen 3 API is currently in preview and requires Vertex AI setup. Tezliklə əlavə ediləcək!");
        }

        throw new Error(`Bilinməyən provayder: ${provider}`);
      });

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
