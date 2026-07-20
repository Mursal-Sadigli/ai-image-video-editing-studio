import { db } from "../index";
import { subscriptions } from "../schema";
import { eq } from "drizzle-orm";

export async function upsertSubscription(data: typeof subscriptions.$inferInsert) {
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, data.stripeSubscriptionId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(subscriptions)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, data.stripeSubscriptionId));
  } else {
    await db.insert(subscriptions).values(data);
  }
}

export async function getUserSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);
    
  return result[0] || null;
}
