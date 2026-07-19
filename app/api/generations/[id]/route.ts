import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getGenerationById } from "@/lib/db/queries/generations";
import { getFileById } from "@/lib/db/queries/files";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const { id } = await params;
    const generationId = id;
    
    const generation = await getGenerationById(generationId, userDb[0].id);
    if (!generation) {
      return NextResponse.json({ error: "Generasiya tapılmadı" }, { status: 404 });
    }

    let fileUrl = null;
    if (generation.outputFileId) {
      const file = await getFileById(generation.outputFileId, userDb[0].id);
      if (file) {
        fileUrl = file.url;
      }
    }

    return NextResponse.json({ generation, fileUrl });
  } catch (error: unknown) {
    console.error("GET /api/generations/[id] error:", error);
    let errorMessage = "Daxili server xətası";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
