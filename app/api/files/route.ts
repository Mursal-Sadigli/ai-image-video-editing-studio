import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";
import { createFile, getUserFiles, getProjectFiles } from "@/lib/db/queries/files";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const fileSchema = z.object({
  projectId: z.string().uuid().optional(),
  imagekitFileId: z.string(),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  fileName: z.string(),
  fileType: z.enum(["image", "video", "audio", "other"]),
  mimeType: z.string().optional(),
  sizeBytes: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const projectId = req.nextUrl.searchParams.get("projectId");
    
    let filesList;
    if (projectId) {
      filesList = await getProjectFiles(projectId, userDb[0].id);
    } else {
      filesList = await getUserFiles(userDb[0].id);
    }

    return NextResponse.json({ files: filesList });
  } catch (error: any) {
    console.error("GET /api/files error:", error);
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "İcazəsiz giriş" }, { status: 401 });

    const userDb = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1);
    if (!userDb.length) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const body = await req.json();
    const validatedData = fileSchema.parse(body);

    const newFile = await createFile({
      userId: userDb[0].id,
      ...validatedData,
    });

    return NextResponse.json({ file: newFile }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/files error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Daxili server xətası" }, { status: 500 });
  }
}
