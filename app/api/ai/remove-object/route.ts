import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";
import { inngest } from "@/lib/inngest/client";
import { CREDIT_COSTS } from "@/config/pricing";
import { deductCredits } from "@/lib/credits/deduct";
import { CREDIT_COSTS } from "@/config/pricing";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fileUrl, prompt, teamId } = await req.json();
    if (!fileUrl || !prompt) {
      return NextResponse.json({ error: "Şəkil URL və prompt mütləqdir" }, { status: 400 });
    }

    const cost = CREDIT_COSTS.object_removal;
    
    // Kredit çıxırıq (Team və ya User fərqi yoxdur deduct həll edəcək)
    const { userId: dbUserId } = await deductCredits(user.id, cost, teamId);

    // Generasiya qeydi
    const [generation] = await db.insert(generations).values({
      userId: dbUserId,
      teamId: teamId || null,
      type: "object_removal",
      status: "queued",
      prompt: prompt,
      creditsCost: cost,
    }).returning({ id: generations.id });

    // Inngest Event
    await inngest.send({
      name: "ai/object-removal",
      data: {
        generationId: generation.id,
        userId: dbUserId,
        fileUrl,
        prompt,
      },
    });

    return NextResponse.json({ generationId: generation.id });
  } catch (error: unknown) {
    console.error("[OBJECT_REMOVAL_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Xəta baş verdi";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
