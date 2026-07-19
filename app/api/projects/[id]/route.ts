import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { getProjectById, updateProject, deleteProject, getProjectGenerations } from "@/lib/db/queries/projects";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const updateProjectSchema = z.object({
  name: z.string().min(1, "Layihənin adı boş ola bilməz").max(100).optional(),
  description: z.string().max(500).optional(),
  isArchived: z.boolean().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const { id } = await params;
    const projectId = id;
    const project = await getProjectById(projectId, userDb[0].id);
    
    if (!project) {
      return NextResponse.json({ error: "Layihə tapılmadı və ya icazəniz yoxdur" }, { status: 404 });
    }

    const generations = await getProjectGenerations(projectId, userDb[0].id);

    return NextResponse.json({ project, generations });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const { id } = await params;
    const projectId = id;
    const body = await req.json();
    const validatedData = updateProjectSchema.parse(body);

    const updatedProject = await updateProject(projectId, userDb[0].id, validatedData);
    
    if (!updatedProject) {
      return NextResponse.json({ error: "Layihə tapılmadı və ya icazəniz yoxdur" }, { status: 404 });
    }

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    console.error("PATCH /api/projects/[id] error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const { id } = await params;
    const projectId = id;
    const deletedProject = await deleteProject(projectId, userDb[0].id);
    
    if (!deletedProject) {
      return NextResponse.json({ error: "Layihə tapılmadı və ya icazəniz yoxdur" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Layihə silindi" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}
