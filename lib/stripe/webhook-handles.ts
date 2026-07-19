import Stripe from "stripe";
import { addCreditTransaction } from "@/lib/db/queries/credits";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  
  if (!metadata || !metadata.userId) {
    console.error("No metadata found for session:", session.id);
    return;
  }

  const userId = metadata.userId;
  const creditsAmount = parseInt(metadata.creditsAmount || "0", 10);
  const type = metadata.type;

  if (type === "credit_pack" && creditsAmount > 0) {
    // Verilənlər bazasından istifadəçinin cari balansını alırıq (sadəcə logs üçün, əslində ledger update edəcək)
    const userDb = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!userDb.length) {
      console.error("User not found:", userId);
      return;
    }

    // Ledger-ə kredit alışını yazırıq
    await addCreditTransaction({
      userId,
      amount: creditsAmount,
      balanceAfter: userDb[0].creditsBalance + creditsAmount, // Bu sadəcə indikator kimidir, əsl trigger/update arxada olacaq
      type: "purchase",
      description: `Stripe vasitəsilə ${creditsAmount} kredit alışı`,
    });

    // Qeyd: addCreditTransaction daxilində update istifadəçinin balansını da yeniləyir.
    console.log(`Uğurla ${creditsAmount} kredit əlavə olundu. User: ${userId}`);
  }
}
