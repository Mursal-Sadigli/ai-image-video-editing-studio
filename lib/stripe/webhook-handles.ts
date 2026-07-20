import Stripe from "stripe";
import { addCreditTransaction } from "@/lib/db/queries/credits";
import { db } from "@/lib/db";
import { users, subscriptionStatusEnum, subscriptionPlanEnum } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PLANS } from "@/config/pricing";
import { upsertSubscription } from "@/lib/db/queries/subscriptions";

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  
  if (!metadata || !metadata.userId) {
    console.error("No metadata found for session:", session.id);
    return;
  }

  const userId = metadata.userId;
  const type = metadata.type;

  const userDb = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!userDb.length) {
    console.error("User not found:", userId);
    return;
  }

  if (type === "credit_pack") {
    const creditsAmount = parseInt(metadata.creditsAmount || "0", 10);
    if (creditsAmount > 0) {
      await addCreditTransaction({
        userId,
        amount: creditsAmount,
        balanceAfter: userDb[0].creditsBalance + creditsAmount,
        type: "purchase",
        description: `Stripe vasitəsilə ${creditsAmount} kredit alışı`,
      });
      console.log(`Uğurla ${creditsAmount} kredit əlavə olundu. User: ${userId}`);
    }
  } else if (type === "subscription") {
    const planId = metadata.planId;
    const plan = Object.values(PLANS).find(p => p.id === planId);
    
    if (plan) {
      // Abunəlik kreditlərini əlavə et
      await addCreditTransaction({
        userId,
        amount: plan.monthlyCredits,
        balanceAfter: userDb[0].creditsBalance + plan.monthlyCredits,
        type: "subscription",
        description: `${plan.name} planı aktivləşdirildi`,
      });
      console.log(`Uğurla ${plan.name} planı üçün ${plan.monthlyCredits} kredit əlavə olundu. User: ${userId}`);
    }
  }
}

export async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  // `customer` istifadəçini tapmaq üçündür.
  const customerId = subscription.customer as string;
  
  const userDb = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);
  
  let userId = userDb[0]?.id;

  // Əgər stripeCustomerId ilə tapılmırsa, ola bilər ki session-dan gələn metadata kömək etsin
  if (!userId && subscription.metadata && subscription.metadata.userId) {
    userId = subscription.metadata.userId;
    
    // İstifadəçinin stripeCustomerId sütununu yeniləyək ki, gələcəkdə asan tapılsın
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, userId));
  }

  if (!userId) {
    console.error("User not found for subscription:", subscription.id);
    return;
  }

  const priceId = subscription.items.data[0].price.id;
  
  // Hansı plan olduğunu PriceID və ya metadatadan təyin edirik
  // Qeyd: Əsl məhsul mühitində planı tapmaq üçün `subscription.metadata.planId` və ya `priceId` istifadə olunur
  const planId = subscription.metadata?.planId || "pro"; 

  await upsertSubscription({
    userId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    plan: planId as any,
    status: subscription.status as any,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });

  console.log(`Subscription updated in DB. User: ${userId}, Status: ${subscription.status}`);
}
