import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe/client";

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
    const { creditsAmount, priceId } = body;

    // TODO: Gələcəkdə config/pricing.ts vasitəsilə validasiya edin.
    // MVP üçün sadə olaraq məbləğ və kredit sayını test olaraq yaradırıq.
    
    // Qeyd: Stripe-da adətən Məhsul (Product) və Qiymət (Price) yaradılır və onların price_id-si bura göndərilir.
    // Lakin test məqsədilə biz "price_data" ilə "on-the-fly" məhsul da yarada bilərik.
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: dbUser.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${creditsAmount || 100} AI Kredit Paketi`,
              description: "Vision AI platformasında istifadə üçün kreditlər",
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/billing?canceled=true`,
      metadata: {
        userId: dbUser.id,
        creditsAmount: creditsAmount || 100,
        type: "credit_pack",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    let errorMessage = "Xəta baş verdi";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
