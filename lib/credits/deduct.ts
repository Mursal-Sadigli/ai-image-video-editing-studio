import { db } from "@/lib/db";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function deductCredits(clerkUserId: string, cost: number, teamId?: string | null) {
  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkId, clerkUserId),
  });

  if (!dbUser) {
    throw new Error("İstifadəçi tapılmadı");
  }

  // Komanda mühiti
  if (teamId) {
    const membership = await db.query.teamMembers.findFirst({
      where: and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, dbUser.id)),
      with: {
        team: true,
      }
    });

    if (!membership || !membership.team) {
      throw new Error("Komanda tapılmadı və ya icazəniz yoxdur");
    }

    if (membership.team.creditsBalance < cost) {
      throw new Error("Komandanın kifayət qədər krediti yoxdur.");
    }

    await db.update(teams)
      .set({ creditsBalance: membership.team.creditsBalance - cost })
      .where(eq(teams.id, teamId));

    return { userId: dbUser.id, teamId };
  }

  // Fərdi mühit
  if (dbUser.creditsBalance < cost) {
    throw new Error("Kifayət qədər kreditiniz yoxdur.");
  }

  await db.update(users)
    .set({ creditsBalance: dbUser.creditsBalance - cost })
    .where(eq(users.id, dbUser.id));

  return { userId: dbUser.id, teamId: null };
}
