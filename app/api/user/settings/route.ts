import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!userRecord) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      keys: {
        falApiKey: userRecord.falApiKey || "",
        replicateApiKey: userRecord.replicateApiKey || "",
        openaiApiKey: userRecord.openaiApiKey || "",
        googleApiKey: userRecord.googleApiKey || "",
      }
    });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { falApiKey, replicateApiKey, openaiApiKey, googleApiKey } = body;

    await db.update(users)
      .set({
        falApiKey: falApiKey || null,
        replicateApiKey: replicateApiKey || null,
        openaiApiKey: openaiApiKey || null,
        googleApiKey: googleApiKey || null,
      })
      .where(eq(users.clerkId, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
