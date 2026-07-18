import { db } from "@/lib/db";
import { creditTransactions, users } from "@/lib/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import type { CreditTransaction, NewCreditTransaction } from "@/types/db";

// =========================================================
// Credit Əməliyyatları (Ledger əsaslı)
// =========================================================

/**
 * Credit balansını ledger-dən hesabla
 * AGENTS.md qaydası: credits_balance heç vaxt birbaşa UPDATE olunmamalıdır
 */
export async function calculateCreditBalance(
  userId: string
): Promise<number> {
  const result = await db
    .select({
      balance: sql<number>`COALESCE(SUM(${creditTransactions.amount}), 0)`,
    })
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId));

  return result[0]?.balance ?? 0;
}

/**
 * Credit tranzaksiyası əlavə et (atomik — balansı da yeniləyir)
 */
export async function addCreditTransaction(
  data: NewCreditTransaction
): Promise<CreditTransaction> {
  // 1. Ledger yazısı əlavə et
  const [transaction] = await db
    .insert(creditTransactions)
    .values(data)
    .returning();

  // 2. users.credits_balance-ı yenilə (ledger-dən sync)
  if (data.userId) {
    await db
      .update(users)
      .set({
        creditsBalance: sql`${users.creditsBalance} + ${data.amount}`,
      })
      .where(eq(users.id, data.userId));
  }

  return transaction;
}

/**
 * İstifadəçinin credit tarixçəsini əldə et
 */
export async function getUserCreditHistory(
  userId: string,
  limit = 20,
  offset = 0
): Promise<CreditTransaction[]> {
  return db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit)
    .offset(offset);
}

/**
 * Kredit kifayət edirmi yoxla
 */
export async function hasEnoughCredits(
  userId: string,
  requiredCredits: number
): Promise<boolean> {
  const user = await db
    .select({ creditsBalance: users.creditsBalance })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (user[0]?.creditsBalance ?? 0) >= requiredCredits;
}

/**
 * Pulsuz başlanğıc creditləri ver (qeydiyyat zamanı)
 */
export async function grantSignupCredits(
  userId: string,
  amount: number
): Promise<CreditTransaction> {
  return addCreditTransaction({
    userId,
    amount,
    balanceAfter: amount, // yeni istifadəçi olduğu üçün balans = verilən miqdar
    type: "bonus",
    description: `Qeydiyyat bonusu: ${amount} credit`,
  });
}
