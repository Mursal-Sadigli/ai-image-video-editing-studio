import { inngest } from "../client";
import { db } from "@/lib/db";
import { generations, files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Dummy Mock AI Processor Function
const mockAiProcess = async (type: string, payload: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
        id: `mock_file_${Date.now()}`
      });
    }, 4000);
  });
};

export const processBackgroundRemoval = inngest.createFunction(
  { id: "process-background-removal" },
  { event: "ai/background-removal" },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl } = event.data;

    // 1. Emulyasiya edilmiş AI Prosesi
    const result = await step.run("run-ai-model", async () => {
      return await mockAiProcess("background_removal", { fileUrl });
    });

    // 2. Faylı bazaya yaz
    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        name: "bg-removed.png",
        url: (result as any).url,
        type: "image",
        size: 1024,
      }).returning({ id: files.id });
      return newFile.id;
    });

    // 3. Generasiyanı tamamla
    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        fileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);

export const processUpscaler = inngest.createFunction(
  { id: "process-upscaler" },
  { event: "ai/upscaler" },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl, scale } = event.data;

    const result = await step.run("run-ai-model", async () => {
      return await mockAiProcess("upscaler", { fileUrl, scale });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        name: "upscaled.png",
        url: (result as any).url,
        type: "image",
        size: 4096,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        fileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);
