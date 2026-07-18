import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getGenerationById } from "@/lib/db/queries/generations";
import { getFileById } from "@/lib/db/queries/files";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    
    // Daxili User ID tap (DB-dən)
    const dbUser = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1).then(r => r[0]);
    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }
    const internalUserId = dbUser.id;

    const generation = await getGenerationById(id);
    if (!generation || generation.userId !== internalUserId) {
      return new NextResponse(JSON.stringify({ error: "Not Found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    let outputUrl = null;
    if (generation.outputFileId) {
      const file = await getFileById(generation.outputFileId, internalUserId);
      if (file) {
        outputUrl = file.url;
      }
    }

    return NextResponse.json({
      status: generation.status,
      outputUrl,
      error: (generation.parameters as any)?.error,
    });
  } catch (error) {
    console.error("[STATUS_CHECK_ERROR]", error);
    return new NextResponse("Daxili server xətası", { status: 500 });
  }
}
