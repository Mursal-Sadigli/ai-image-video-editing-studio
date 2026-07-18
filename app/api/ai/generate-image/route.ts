import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "@/lib/inngest/client";
import { hasEnoughCredits, addCreditTransaction } from "@/lib/db/queries/credits";
import { createGeneration } from "@/lib/db/queries/generations";
import { z } from "zod";

const requestSchema = z.object({
  prompt: z.string().min(3, "Prompt çox qısadır"),
  aspectRatio: z.string().optional().default("1:1"),
  style: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const result = requestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { prompt, aspectRatio, style } = result.data;
    const creditsCost = 1; // 1 şəkil = 1 kredit

    // 1. Kredit balansını yoxla
    const hasEnough = await hasEnoughCredits(userId, creditsCost);
    if (!hasEnough) {
      return NextResponse.json({ error: "Kifayət qədər kreditiniz yoxdur" }, { status: 402 });
    }

    // 2. Krediti dərhal çıx (spam-ın qarşısını almaq üçün)
    // Əgər proses uğursuz olsa, Inngest refund edəcək.
    const transaction = await addCreditTransaction({
      userId,
      amount: -creditsCost,
      balanceAfter: 0, // MVP üçün default
      type: "usage",
      description: "AI Şəkil Generasiyası",
    });

    // 3. DB-də Generation (Queued) qeydi yarat
    const generation = await createGeneration({
      userId,
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
        userId: userId,
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
    return new NextResponse("Daxili server xətası", { status: 500 });
  }
}
