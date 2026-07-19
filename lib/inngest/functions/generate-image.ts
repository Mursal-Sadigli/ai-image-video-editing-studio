import { inngest } from "../client";
import { updateGenerationStatus } from "@/lib/db/queries/generations";
import { addCreditTransaction } from "@/lib/db/queries/credits";
import { createFile } from "@/lib/db/queries/files";

export const generateImage = inngest.createFunction(
  { id: "generate-image", name: "Generate AI Image", triggers: [{ event: "ai/generate.image" }] },
  async ({ event, step }) => {
    const { generationId, userId, prompt, creditsCost, modelId, provider } = event.data;

    // 1. Update status to processing
    await step.run("update-status-processing", async () => {
      await updateGenerationStatus(generationId, { status: "processing" });
    });

    try {
      // 2. Router: Provayderə uyğun modeli çağır
      const aiResult = await step.run("call-ai-model", async () => {
        try {
          if (modelId === "huggingface-flux" || provider === "other") {
            const hfKey = process.env.HUGGINGFACE_API_KEY;
            if (!hfKey) throw new Error("Hugging Face API açarı tapılmadı.");

            const response = await fetch(
              "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${hfKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ inputs: prompt }),
              }
            );

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`Hugging Face Error (${response.status}): ${errText.substring(0, 150)}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const base64Image = Buffer.from(arrayBuffer).toString("base64");

            return { url: `data:image/jpeg;base64,${base64Image}` };
          }

          throw new Error(`Bilinməyən provayder: ${provider}`);
        } catch (e: unknown) {
          if (e instanceof Error) {
            return { error: e.message };
          }
          return { error: "Bilinməyən xəta" };
        }
      });

      if (aiResult.error) {
        throw new Error(aiResult.error);
      }

      const outputUrl = aiResult.url!;

      // 3. Save generated file to DB (Normally upload to ImageKit first, but we skip for MVP)
      const fileId = await step.run("save-file-record", async () => {
        const newFile = await createFile({
          userId: userId,
          imagekitFileId: `hf-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          fileName: `generation-${generationId}.jpeg`,
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
    } catch (error: unknown) {
      // 5. Handle failure: update status and refund credit
      await step.run("handle-failure", async () => {
        let errorMessage = "Bilinməyən xəta baş verdi";
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        await updateGenerationStatus(generationId, {
          status: "failed",
          error: errorMessage,
        });

        // Refund credit
        await addCreditTransaction({
          userId: userId,
          amount: creditsCost,
          balanceAfter: 0,
          type: "refund",
          description: "Şəkil generasiyası uğursuz oldu (Refund)",
          generationId: generationId,
        });
      });

      throw error; // Re-throw so Inngest knows the step failed overall
    }
  }
);
