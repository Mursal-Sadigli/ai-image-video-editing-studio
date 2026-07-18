import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { inngest } from "@/lib/inngest/client";
import { hasEnoughCredits, addCreditTransaction } from "@/lib/db/queries/credits";
import { createGeneration } from "@/lib/db/queries/generations";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const requestSchema = z.object({
  prompt: z.string().min(3, "Prompt çox qısadır"),
  aspectRatio: z.string().optional().default("1:1"),
  style: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clerkId = user.id;
    const email = user.emailAddresses[0]?.emailAddress || "unknown@visionai.com";

    // Mərhələ 4 üçün MVP Sync: Əgər user yoxdursa DB-yə əlavə edirik (Webhook qurulana qədər)
    let dbUser = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1).then(r => r[0]);
    if (!dbUser) {
      const [newUser] = await db.insert(users).values({
        clerkId,
        email,
        fullName: user.firstName ? `${user.firstName} ${user.lastName || ""}` : "User",
        creditsBalance: 20, // Yeni userə 20 kredit
      }).returning();
      dbUser = newUser;
    }

    const internalUserId = dbUser.id; // UUID from database

    const body = await req.json();
    const result = requestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { prompt, aspectRatio, style } = result.data;
    const creditsCost = 1; // 1 şəkil = 1 kredit

    // 1. Kredit balansını yoxla (DB User id ilə)
    const hasEnough = await hasEnoughCredits(internalUserId, creditsCost);
    if (!hasEnough) {
      return NextResponse.json({ error: "Kifayət qədər kreditiniz yoxdur" }, { status: 402 });
    }

    // 2. Krediti dərhal çıx (spam-ın qarşısını almaq üçün)
    const transaction = await addCreditTransaction({
      userId: internalUserId,
      amount: -creditsCost,
      balanceAfter: 0, // MVP üçün default
      type: "usage",
      description: "AI Şəkil Generasiyası",
    });

    // 3. DB-də Generation (Queued) qeydi yarat
    const generation = await createGeneration({
      userId: internalUserId,
      type: "image_generation",
      prompt,
      provider: "replicate",
      modelName: "black-forest-labs/flux-schnell",
      parameters: { aspectRatio, style },
      creditsCost,
    });

    // 4. Inngest Background Job-u başlat
    await inngest.send({
      name: "ai/generate.image",
      data: {
        generationId: generation.id,
        userId: internalUserId,
        prompt: prompt,
        creditsCost: creditsCost,
      },
    });

    return NextResponse.json({ 
      success: true, 
      generationId: generation.id 
    });

  } catch (error: any) {
    console.error("[GENERATE_IMAGE_ERROR]", error);
    require('fs').appendFileSync('error.log', new Date().toISOString() + ' ' + error.stack + '\n');
    return NextResponse.json({ 
      error: "Daxili server xətası", 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
