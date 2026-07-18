import { db } from "../index";
import { files } from "../schema";
import { eq, desc, and } from "drizzle-orm";
import type { InsertFile } from "@/types/db";

export async function getUserFiles(userId: string) {
  return db
    .select()
    .from(files)
    .where(eq(files.userId, userId))
    .orderBy(desc(files.createdAt));
}

export async function getProjectFiles(projectId: string, userId: string) {
  return db
    .select()
    .from(files)
    .where(and(eq(files.projectId, projectId), eq(files.userId, userId)))
    .orderBy(desc(files.createdAt));
}

export async function getFileById(fileId: string, userId: string) {
  const result = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .limit(1);
    
  return result[0] || null;
}

export async function createFile(data: InsertFile) {
  const result = await db
    .insert(files)
    .values(data)
    .returning();
    
  return result[0];
}

export async function deleteFile(fileId: string, userId: string) {
  const result = await db
    .delete(files)
    .where(and(eq(files.id, fileId), eq(files.userId, userId)))
    .returning();
    
  return result[0];
}
