import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { teams, teamMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1).then(res => res[0]);
    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // İstifsdəçinin daxil olduğu bütün komandaları tap
    const userTeams = await db.query.teamMembers.findMany({
      where: eq(teamMembers.userId, dbUser.id),
      with: {
        team: true,
      },
    });

    const formattedTeams = userTeams.map((member) => ({
      id: member.team.id,
      name: member.team.name,
      slug: member.team.slug,
      logoUrl: member.team.logoUrl,
      role: member.role,
    }));

    return NextResponse.json({ teams: formattedTeams });
  } catch (error) {
    console.error("[MY_TEAMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
