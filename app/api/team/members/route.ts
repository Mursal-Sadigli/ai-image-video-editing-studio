import { NextResponse } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { teamMembers, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      return new NextResponse("Team ID is required", { status: 400 });
    }

    // İcazəni yoxla (İstifadəçi bu komandanın üzvüdürmü?)
    const membership = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
    });

    if (!membership) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.teamId, teamId),
      with: {
        user: true,
      },
    });

    // Clerk-dən istifadəçi məlumatlarını (ad, şəkil) çəkmək olar, amma hələlik db-də olan `users` datası ilə kifayətlənirik.
    const formattedMembers = members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      joinedAt: m.joinedAt,
      // Əgər users cədvəlində name/email varsa, buradan veririk. Yoxdursa Clerk-dən fethe etmək olar
      user: {
        id: m.user.id,
        email: m.user.email,
        name: m.user.firstName + " " + m.user.lastName,
        imageUrl: m.user.profileImageUrl,
      },
    }));

    return NextResponse.json({ members: formattedMembers });
  } catch (error) {
    console.error("[TEAM_MEMBERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const updateRoleSchema = z.object({
  teamId: z.string(),
  memberUserId: z.string(),
  newRole: z.enum(["owner", "admin", "editor", "viewer"]),
});

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { teamId, memberUserId, newRole } = updateRoleSchema.parse(body);

    // Yalnız owner və ya admin rolu dəyişə bilər
    const currentMembership = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
    });

    if (!currentMembership || (currentMembership.role !== "owner" && currentMembership.role !== "admin")) {
      return new NextResponse("Forbidden - Admin rights required", { status: 403 });
    }

    await db.update(teamMembers)
      .set({ role: newRole })
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, memberUserId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEAM_MEMBERS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

const deleteMemberSchema = z.object({
  teamId: z.string(),
  memberUserId: z.string(),
});

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { teamId, memberUserId } = deleteMemberSchema.parse(body);

    const currentMembership = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
    });

    // Yalnız owner/admin silə bilər, və ya istifadəçi özü çıxa bilər
    if (
      !currentMembership ||
      (currentMembership.role !== "owner" && currentMembership.role !== "admin" && userId !== memberUserId)
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await db.delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, memberUserId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TEAM_MEMBERS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
