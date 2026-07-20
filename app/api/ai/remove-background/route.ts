import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, generations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { inngest } from "@/lib/inngest/client";
import { CREDIT_COSTS } from "@/config/pricing";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1).then(res => res[0]);
    if (!dbUser) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });

    const { fileUrl } = await req.json();
    if (!fileUrl) {
      return NextResponse.json({ error: "Şəkil URL mütləqdir" }, { status: 400 });
    }

    const cost = CREDIT_COSTS.background_removal;
    if (dbUser.creditsBalance < cost) {
      return NextResponse.json({ error: "Kifayət qədər kreditiniz yoxdur." }, { status: 402 });
    }

    // Kredit çıxırıq
    await db.update(users)
      .set({ creditsBalance: dbUser.creditsBalance - cost })
      .where(eq(users.id, dbUser.id));

    // Generasiya qeydi
    const [generation] = await db.insert(generations).values({
      userId: dbUser.id,
      type: "background_removal",
      status: "queued",
      prompt: "Arxa fon silinməsi",
      cost,
    }).returning({ id: generations.id });

    // Inngest Event
    await inngest.send({
      name: "ai/background-removal",
      data: {
        generationId: generation.id,
        userId: dbUser.id,
        fileUrl,
      },
    });

    return NextResponse.json({ generationId: generation.id });
  } catch (error: any) {
    console.error("[BG_REMOVAL_ERROR]", error);
    return NextResponse.json({ error: error.message || "Xəta baş verdi" }, { status: 500 });
  }
}
