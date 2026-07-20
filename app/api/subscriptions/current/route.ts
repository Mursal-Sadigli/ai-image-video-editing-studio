import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserSubscription } from "@/lib/db/queries/subscriptions";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getUserSubscription(user.id);
    return NextResponse.json({ subscription });
  } catch (error: unknown) {
    console.error("[CURRENT_SUBSCRIPTION_ERROR]", error);
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}
