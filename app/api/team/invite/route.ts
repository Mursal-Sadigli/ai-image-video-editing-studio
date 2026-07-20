import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { teamInvites, teamMembers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

const inviteSchema = z.object({
  teamId: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1).then(res => res[0]);
    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const { teamId, email, role } = inviteSchema.parse(body);

    // İcazə yoxla (yalnız owner və admin dəvət göndərə bilər)
    const currentMembership = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, dbUser.id)),
    });

    if (!currentMembership || (currentMembership.role !== "owner" && currentMembership.role !== "admin")) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 gün etibarlıdır

    const [invite] = await db.insert(teamInvites).values({
      teamId,
      email,
      role,
      token,
      invitedBy: dbUser.id,
      expiresAt,
    }).returning();

    // TODO: Burada Resend vasitəsilə email göndərilməlidir
    // const link = `${process.env.NEXT_PUBLIC_APP_URL}/team/invite?token=${token}`;
    
    return NextResponse.json({ invite });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("[TEAM_INVITE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const acceptInviteSchema = z.object({
  token: z.string(),
});

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1).then(res => res[0]);
    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const { token } = acceptInviteSchema.parse(body);

    const invite = await db.query.teamInvites.findFirst({
      where: eq(teamInvites.token, token),
    });

    if (!invite) {
      return new NextResponse("Invalid token", { status: 404 });
    }

    if (new Date() > new Date(invite.expiresAt)) {
      return new NextResponse("Token expired", { status: 400 });
    }

    if (invite.acceptedAt) {
      return new NextResponse("Invite already accepted", { status: 400 });
    }

    // Əgər artıq üzvdürsə
    const existingMember = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, invite.teamId), eq(teamMembers.userId, dbUser.id)),
    });

    if (existingMember) {
      return new NextResponse("Already a member", { status: 400 });
    }

    await db.insert(teamMembers).values({
      teamId: invite.teamId,
      userId: dbUser.id,
      role: invite.role,
      invitedBy: invite.invitedBy,
    });

    await db.update(teamInvites)
      .set({ acceptedAt: new Date() })
      .where(eq(teamInvites.id, invite.id));

    return NextResponse.json({ success: true, teamId: invite.teamId });
  } catch (error) {
    console.error("[TEAM_INVITE_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
