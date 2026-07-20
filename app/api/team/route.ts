import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { teams, teamMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";

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

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + crypto.randomUUID().substring(0, 8);

    const [team] = await db.insert(teams).values({
      name,
      slug,
      ownerId: dbUser.id,
      creditsBalance: 0, // Başlanğıc kreditlər 0 və ya təyinatlı bir miqdar
    }).returning();

    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: dbUser.id,
      role: "owner", // Yaradan avtomatik owner olur
    });

    return NextResponse.json({ team });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("[TEAM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
