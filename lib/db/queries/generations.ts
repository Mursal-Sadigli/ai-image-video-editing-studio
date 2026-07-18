import { eq, desc, sql } from "drizzle-orm";
import { db } from "../index";
import { generations } from "../schema";

export async function createGeneration(data: {
  userId: string;
  type: "image_generation" | "image_to_image" | "video_generation" | "video_editing" | "background_removal" | "upscale" | "object_removal";
  prompt?: string;
  provider?: string;
  modelName?: string;
  parameters?: any;
  creditsCost?: number;
  projectId?: string;
  teamId?: string;
}) {
  const [generation] = await db
    .insert(generations)
    .values({
      userId: data.userId,
      type: data.type,
      prompt: data.prompt,
      provider: data.provider,
      modelName: data.modelName,
      parameters: data.parameters || {},
      creditsCost: data.creditsCost || 0,
      projectId: data.projectId,
      teamId: data.teamId,
      status: "queued",
    })
    .returning();
  
  return generation;
}

export async function updateGenerationStatus(
  id: string,
  data: {
    status: "queued" | "processing" | "completed" | "failed";
    outputFileId?: string;
    error?: string;
  }
) {
  const updateData: any = { status: data.status };
  if (data.outputFileId) updateData.outputFileId = data.outputFileId;
  // Note: we might want to store error in parameters or a new error column
  if (data.error) {
    updateData.parameters = sql`jsonb_set(COALESCE(parameters, '{}'::jsonb), '{error}', ${JSON.stringify(data.error)}::jsonb)`;
  }

  const [generation] = await db
    .update(generations)
    .set(updateData)
    .where(eq(generations.id, id))
    .returning();
  
  return generation;
}

export async function getGenerationById(id: string) {
  const [generation] = await db
    .select()
    .from(generations)
    .where(eq(generations.id, id));
  return generation;
}

export async function getUserGenerations(userId: string) {
  return db
    .select()
    .from(generations)
    .where(eq(generations.userId, userId))
    .orderBy(desc(generations.createdAt));
}
