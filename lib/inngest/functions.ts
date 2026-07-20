import { inngest } from "./client";
import { db } from "@/lib/db";
import { generations, files } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface EventData {
  generationId: string;
  userId: string;
  fileUrl?: string;
  prompt?: string;
  scale?: number;
}

// Dummy Mock AI Processor Function
const mockAiProcess = async (type: string, payload: Record<string, unknown>) => {
  return new Promise<{ url: string; id: string }>((resolve) => {
    setTimeout(() => {
      resolve({
        url: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba",
        id: `mock_file_${Date.now()}`
      });
    }, 4000);
  });
};

export const processBackgroundRemoval = inngest.createFunction(
  { id: "process-background-removal", triggers: [{ event: "ai/background-removal" }] },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl } = event.data as EventData;

    const result = await step.run("run-ai-model", async () => {
      return await mockAiProcess("background_removal", { fileUrl });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        fileName: "bg-removed.png",
        url: result.url,
        fileType: "image",
        sizeBytes: 1024,
        imagekitFileId: result.id,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        outputFileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);

export const processUpscaler = inngest.createFunction(
  { id: "process-upscaler", triggers: [{ event: "ai/upscaler" }] },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl, scale } = event.data as EventData;

    const result = await step.run("run-ai-model", async () => {
      return await mockAiProcess("upscaler", { fileUrl, scale });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        fileName: "upscaled.png",
        url: result.url,
        fileType: "image",
        sizeBytes: 2048,
        imagekitFileId: result.id,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        outputFileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);

export const processImageToImage = inngest.createFunction(
  { id: "process-image-to-image", triggers: [{ event: "ai/image-to-image" }] },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl, prompt } = event.data as EventData;

    const result = await step.run("run-ai-model", async () => {
      return await mockAiProcess("image_to_image", { fileUrl, prompt });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        fileName: "img-to-img.png",
        url: result.url,
        fileType: "image",
        sizeBytes: 1024,
        imagekitFileId: result.id,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        outputFileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);

export const processObjectRemoval = inngest.createFunction(
  { id: "process-object-removal", triggers: [{ event: "ai/object-removal" }] },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl, prompt } = event.data as EventData;

    const result = await step.run("run-ai-model", async () => {
      return await mockAiProcess("object_removal", { fileUrl, prompt });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        fileName: "obj-removed.png",
        url: result.url,
        fileType: "image",
        sizeBytes: 1024,
        imagekitFileId: result.id,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        outputFileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);

export const processVideoGeneration = inngest.createFunction(
  { id: "process-video-generation", triggers: [{ event: "ai/generate-video" }] },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl, prompt } = event.data as EventData;

    const result = await step.run("run-ai-model", async () => {
      return new Promise<{ url: string; id: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            id: `mock_video_${Date.now()}`
          });
        }, 7000);
      });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        fileName: "generated-video.mp4",
        url: result.url,
        fileType: "video",
        sizeBytes: 51200,
        imagekitFileId: result.id,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        outputFileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);

export const processVideoEditing = inngest.createFunction(
  { id: "process-video-editing", triggers: [{ event: "ai/video-editing" }] },
  async ({ event, step }) => {
    const { generationId, userId, fileUrl, prompt } = event.data as EventData;

    const result = await step.run("run-ai-model", async () => {
      return new Promise<{ url: string; id: string }>((resolve) => {
        setTimeout(() => {
          resolve({
            url: "https://www.w3schools.com/html/mov_bbb.mp4",
            id: `mock_video_edit_${Date.now()}`
          });
        }, 7000);
      });
    });

    const fileRecordId = await step.run("save-file", async () => {
      const [newFile] = await db.insert(files).values({
        userId,
        fileName: "edited-video.mp4",
        url: result.url,
        fileType: "video",
        sizeBytes: 51200,
        imagekitFileId: result.id,
      }).returning({ id: files.id });
      return newFile.id;
    });

    await step.run("update-generation", async () => {
      await db.update(generations).set({
        status: "completed",
        outputFileId: fileRecordId,
        completedAt: new Date(),
      }).where(eq(generations.id, generationId));
    });

    return { success: true, fileId: fileRecordId };
  }
);
