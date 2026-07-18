import { db } from "../index";
import { projects, generations } from "../schema";
import { eq, desc, and } from "drizzle-orm";
import type { InsertProject, Project } from "@/types/db";

export async function getUserProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.isArchived, false)))
    .orderBy(desc(projects.updatedAt));
}

export async function getProjectById(projectId: string, userId: string) {
  const result = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);
    
  return result[0] || null;
}

export async function createProject(data: InsertProject) {
  const result = await db
    .insert(projects)
    .values(data)
    .returning();
    
  return result[0];
}

export async function updateProject(
  projectId: string,
  userId: string,
  data: Partial<InsertProject>
) {
  const result = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning();
    
  return result[0];
}

export async function deleteProject(projectId: string, userId: string) {
  const result = await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .returning();
    
  return result[0];
}

// Layihə daxilində olan generasiyaları gətirir
export async function getProjectGenerations(projectId: string, userId: string) {
  return db
    .select()
    .from(generations)
    .where(and(eq(generations.projectId, projectId), eq(generations.userId, userId)))
    .orderBy(desc(generations.createdAt));
}
