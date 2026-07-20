import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, creditTransactions } from "@/lib/db/schema";
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

    if (!dbAdmin || (dbAdmin.role !== "admin" && dbAdmin.role !== "owner")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const transactions = await db.query.creditTransactions.findMany({
      orderBy: [desc(creditTransactions.createdAt)],
      with: {
        user: true, // Hansı istifadəçiyə aiddir
        team: true, // Hansı komandaya aiddir (opsional)
      },
      limit: 100, // Hələlik son 100 tranzaksiya
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("[ADMIN_TRANSACTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
