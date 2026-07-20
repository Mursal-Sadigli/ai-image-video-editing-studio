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

    const { prompt, durationSeconds, modelId, teamId, fileUrl } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt mütləqdir" }, { status: 400 });
    }

    const cost = durationSeconds === 10 ? CREDIT_COSTS.video_generation_10s : CREDIT_COSTS.video_generation_5s;
    
    // Kredit çıxırıq (Team və ya User fərqi yoxdur deduct həll edəcək)
    const { userId: dbUserId } = await deductCredits(user.id, cost, teamId);

    // Generasiya qeydi
    const [generation] = await db.insert(generations).values({
      userId: dbUserId,
      teamId: teamId || null,
      type: "video_generation",
      status: "queued",
      prompt,
      modelName: modelId,
      creditsCost: cost,
    }).returning({ id: generations.id });

    // Inngest Event
    await inngest.send({
      name: "ai/generate-video",
      data: {
        generationId: generation.id,
        userId: dbUserId,
        fileUrl,
        prompt,
      },
    });

    return NextResponse.json({ generationId: generation.id });
  } catch (error: unknown) {
    console.error("[VIDEO_GENERATION_ERROR]", error);
    // DEBUG UCUN
    const fs = require('fs');
    fs.writeFileSync('C:/Users/fullm/Music/ai-image-video-editing-studio/debug-error.log', String(error) + '\n' + (error instanceof Error ? error.stack : ''));
    
    const errorMessage = error instanceof Error ? error.message : "Xəta baş verdi";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
