import { inngest } from "../client";
import { updateGenerationStatus, getGenerationById } from "@/lib/db/queries/generations";
import { addCreditTransaction } from "@/lib/db/queries/credits";
import { createFile } from "@/lib/db/queries/files";

export const generateImage = inngest.createFunction(
  { id: "generate-image", name: "Generate AI Image", triggers: [{ event: "ai/generate.image" }] },
  async ({ event, step }) => {
    const { generationId, userId, prompt, creditsCost } = event.data;

    // 1. Update status to processing
    await step.run("update-status-processing", async () => {
      await updateGenerationStatus(generationId, { status: "processing" });
    });

    try {
      // 2. Mock AI API (Test məqsədilə saxta generasiya)
      const outputUrl = await step.run("mock-ai", async () => {
        // AI generasiya vaxtını simulyasiya edirik (təxminən 3 saniyə)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Hər dəfə fərqli, amma yüksək keyfiyyətli fotorealistik bir Unsplash şəkli qaytarırıq
        const randomId = Math.floor(Math.random() * 1000);
        return `https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1024&q=80&random=${randomId}`;
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
