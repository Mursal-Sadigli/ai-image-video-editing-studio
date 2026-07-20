import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, creditTransactions } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { userId, amount, description } = body;

    if (!userId || !amount) {
      return new NextResponse("Məlumatlar çatışmır", { status: 400 });
    }

    const parsedAmount = parseInt(amount);

    if (isNaN(parsedAmount) || parsedAmount === 0) {
      return new NextResponse("Məbləğ sıfırdan fərqli rəqəm olmalıdır", { status: 400 });
    }

    // Transaction əlavə edilir və balans yenilənir (ardıcıl olaraq - neon-http transaction olmadığı üçün)
    
    // 1. Balansı yenilə
    await db
      .update(users)
      .set({
        creditsBalance: sql`${users.creditsBalance} + ${parsedAmount}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // 2. Transaction (loq) yaz
    await db.insert(creditTransactions).values({
      id: crypto.randomUUID(),
      userId: userId,
      amount: parsedAmount,
      type: "admin_adjustment",
      status: "completed",
      description: description || `Admin tərəfindən düzəliş (${parsedAmount > 0 ? "artırıldı" : "azaldıldı"})`,
    });

    return NextResponse.json({ success: true, message: "Balans uğurla yeniləndi" });
  } catch (error) {
    console.error("[ADMIN_ADJUST_CREDIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
