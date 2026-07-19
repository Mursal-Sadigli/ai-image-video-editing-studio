import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createProject, getUserProjects } from "@/lib/db/queries/projects";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const projectSchema = z.object({
  name: z.string().min(1, "Layihənin adı boş ola bilməz").max(100),
  description: z.string().max(500).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });
    }

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });
    }

    const projectsList = await getUserProjects(userDb[0].id);
    return NextResponse.json({ projects: projectsList });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });
    }

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    const newProject = await createProject({
      userId: userDb[0].id,
      name: validatedData.name,
      description: validatedData.description,
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}
