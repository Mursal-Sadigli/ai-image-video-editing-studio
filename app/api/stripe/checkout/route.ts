import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";
import { PLANS } from "@/config/pricing";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.clerkId, user.id)).limit(1).then(res => res[0]);
    if (!dbUser) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });
    }

    const body = await req.json();
    const { type, planId, creditsAmount, priceCents } = body;

    let sessionUrl = "";

    if (type === "plan" && planId) {
      // Abunəlik planı
      const plan = Object.values(PLANS).find(p => p.id === planId);
      if (!plan) throw new Error("Plan tapılmadı");

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer_email: dbUser.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan.name} Planı`,
                description: `Aylıq ${plan.monthlyCredits} kredit və ${plan.name} imtiyazları`,
              },
              unit_amount: plan.priceMonthly, 
              recurring: { interval: "month" }
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
        metadata: {
          userId: String(dbUser.id),
          planId: String(planId),
          type: "subscription",
        },
      });
      sessionUrl = session.url || "";
    } else {
      // Birdəfəlik kredit paketi
      const amount = creditsAmount || 100;
      const price = priceCents || 500;
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer_email: dbUser.email,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${amount} AI Kredit Paketi`,
                description: "Vision AI platformasında istifadə üçün kreditlər",
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?canceled=true`,
        metadata: {
          userId: String(dbUser.id),
          creditsAmount: String(amount),
          type: "credit_pack",
        },
      });
      sessionUrl = session.url || "";
    }

    return NextResponse.json({ url: sessionUrl });
  } catch (error: unknown) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    let errorMessage = "Xəta baş verdi";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
