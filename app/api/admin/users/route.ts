import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Yalnız Admin icazəsi
    const dbAdmin = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    if (!dbAdmin || dbAdmin.role !== "admin") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Bütün istifadəçiləri çək
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
