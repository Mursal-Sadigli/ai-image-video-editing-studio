import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import {
  syncNewUser,
  syncUpdatedUser,
} from "@/lib/clerk/sync-user";
import { deleteUser } from "@/lib/db/queries/users";
import { sendWelcomeEmail } from "@/lib/email/resend";

// =========================================================
// Clerk Webhook Handler
// =========================================================

// Clerk webhook event tipləri
interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{
      email_address: string;
      id: string;
    }>;
    primary_email_address_id?: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
  };
}

export async function POST(req: NextRequest) {
  // Webhook secret yoxla
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Clerk Webhook] CLERK_WEBHOOK_SECRET təyin edilməyib");
    return NextResponse.json(
      { error: "Webhook secret konfiqurasiya edilməyib" },
      { status: 500 }
    );
  }

  // Svix signature verification
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("[Clerk Webhook] Svix header-ləri tapılmadı");
    return NextResponse.json(
      { error: "Webhook header-ləri çatışmır" },
      { status: 400 }
    );
  }

  const body = await req.text();

  let event: ClerkWebhookEvent;

  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[Clerk Webhook] Signature doğrulaması uğursuz:", err);
    return NextResponse.json(
      { error: "Webhook signature etibarsızdır" },
      { status: 400 }
    );
  }

  // Event-ə görə əməliyyat
  try {
    switch (event.type) {
      case "user.created": {
        const primaryEmail = event.data.email_addresses?.find(
          (e) => e.id === event.data.primary_email_address_id
        );

        if (!primaryEmail) {
          console.error("[Clerk Webhook] İstifadəçinin email-i tapılmadı");
          return NextResponse.json(
            { error: "Email tapılmadı" },
            { status: 400 }
          );
        }

        const fullName = [event.data.first_name, event.data.last_name]
          .filter(Boolean)
          .join(" ") || null;

        await syncNewUser({
          clerkId: event.data.id,
          email: primaryEmail.email_address,
          fullName,
          avatarUrl: event.data.image_url,
        });

        // Xoş Gəldin e-poçtu göndər
        await sendWelcomeEmail(primaryEmail.email_address, event.data.first_name || undefined);

        console.log(
          `[Clerk Webhook] Yeni istifadəçi sinxronizasiya edildi və email göndərildi: ${event.data.id}`
        );
        break;
      }

      case "user.updated": {
        const primaryEmail = event.data.email_addresses?.find(
          (e) => e.id === event.data.primary_email_address_id
        );

        if (!primaryEmail) break;

        const fullName = [event.data.first_name, event.data.last_name]
          .filter(Boolean)
          .join(" ") || null;

        await syncUpdatedUser({
          clerkId: event.data.id,
          email: primaryEmail.email_address,
          fullName,
          avatarUrl: event.data.image_url,
        });

        console.log(
          `[Clerk Webhook] İstifadəçi yeniləndi: ${primaryEmail.email_address}`
        );
        break;
      }

      case "user.deleted": {
        await deleteUser(event.data.id);
        console.log(
          `[Clerk Webhook] İstifadəçi silindi: ${event.data.id}`
        );
        break;
      }

      default:
        console.log(`[Clerk Webhook] İşlənməmiş event: ${event.type}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[Clerk Webhook] Xəta (${event.type}):`, error);
    return NextResponse.json(
      { error: "Webhook işlənərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}
