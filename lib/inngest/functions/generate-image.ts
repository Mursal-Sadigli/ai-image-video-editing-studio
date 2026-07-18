import { inngest } from "../client";
import Replicate from "replicate";
import { updateGenerationStatus, getGenerationById } from "@/lib/db/queries/generations";
import { addCreditTransaction } from "@/lib/db/queries/credits";
import { createFile } from "@/lib/db/queries/files";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "mock-token",
});

export const generateImage = inngest.createFunction(
  { id: "generate-image", name: "Generate AI Image" },
  { event: "ai/generate.image" },
  async ({ event, step }) => {
    const { generationId, userId, prompt, creditsCost } = event.data;

    // 1. Update status to processing
    await step.run("update-status-processing", async () => {
      await updateGenerationStatus(generationId, { status: "processing" });
    });

    try {
      // 2. Call Replicate API
      const outputUrl = await step.run("call-replicate", async () => {
        if (!process.env.REPLICATE_API_TOKEN) {
          // Mock delay for local testing without API key
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return "https://replicate.delivery/pbxt/mock-image-url/out-0.png"; // Mock image
        }

        const output = await replicate.run(
          "black-forest-labs/flux-schnell", // Fast and good model
          {
            input: {
              prompt: prompt,
              aspect_ratio: "1:1",
              output_format: "png",
              output_quality: 100,
            }
          }
        );
        
        // Flux returns an array of streams/urls. We grab the first one.
        if (Array.isArray(output) && output.length > 0) {
          return output[0] as string;
        }
        throw new Error("Invalid output from Replicate");
      });

      // 3. Save generated file to DB (Normally upload to ImageKit first, but we skip for MVP if ImageKit keys are missing)
      const fileId = await step.run("save-file-record", async () => {
        const newFile = await createFile({
          userId: userId,
          name: `generation-${generationId}.png`,
          url: outputUrl,
          fileType: "image",
          size: 0,
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
          type: "refund",
          description: "Şəkil generasiyası uğursuz oldu (Refund)",
          generationId: generationId,
        });
      });

      throw error; // Let Inngest know it failed
    }
  }
);
