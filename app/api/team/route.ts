import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { teams, teamMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const createTeamSchema = z.object({
  name: z.string().min(1, "Komanda adı boş ola bilməz").max(50),
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
    const { name } = createTeamSchema.parse(body);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + uuidv4().substring(0, 8);

    // Transaction daxilində komanda yarat və sahibi üzv kimi əlavə et
    const [newTeam] = await db.transaction(async (tx) => {
      const [team] = await tx.insert(teams).values({
        name,
        slug,
        ownerId: dbUser.id,
        creditsBalance: 0, // Başlanğıc kreditlər 0 və ya təyinatlı bir miqdar
      }).returning();

      await tx.insert(teamMembers).values({
        teamId: team.id,
        userId: dbUser.id,
        role: "owner", // Yaradan avtomatik owner olur
      });

      return [team];
    });

    return NextResponse.json({ team: newTeam });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("[TEAM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
