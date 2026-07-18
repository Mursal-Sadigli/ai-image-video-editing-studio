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
      keys: null // Artıq açarlar yoxdur
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

    // Gələcək user tənzimləmələri buraya əlavə ediləcək
    // Hələlik heç nə etmirik, çünki API açarları silindi
    // const body = await req.json();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SETTINGS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
