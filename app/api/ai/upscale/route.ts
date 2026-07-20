import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";
import { inngest } from "@/lib/inngest/client";
import { CREDIT_COSTS } from "@/config/pricing";
import { deductCredits } from "@/lib/credits/deduct";
import { CREDIT_COSTS } from "@/config/pricing";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success, limit, remaining, reset } = await checkRateLimit(user.id);
    if (!success) {
      return NextResponse.json(
        { error: "Çoxlu sayda sorğu göndərdiniz. Lütfən bir az sonra yenidən cəhd edin." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }

    const { fileUrl, scale, teamId } = await req.json();
    if (!fileUrl) {
      return NextResponse.json({ error: "Şəkil URL mütləqdir" }, { status: 400 });
    }

    const cost = CREDIT_COSTS.upscale;
    
    // Kredit çıxırıq (Team və ya User fərqi yoxdur deduct həll edəcək)
    const { userId: dbUserId } = await deductCredits(user.id, cost, teamId);

    // Generasiya qeydi
    const [generation] = await db.insert(generations).values({
      userId: dbUserId,
      teamId: teamId || null,
      type: "upscale",
      status: "queued",
      prompt: `Böyütmə (${scale}x)`,
      creditsCost: cost,
    }).returning({ id: generations.id });

    // Inngest Event
    await inngest.send({
      name: "ai/upscaler",
      data: {
        generationId: generation.id,
        userId: dbUserId,
        fileUrl,
        scale,
      },
    });

    return NextResponse.json({ generationId: generation.id });
  } catch (error: unknown) {
    console.error("[UPSCALER_ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Xəta baş verdi";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
