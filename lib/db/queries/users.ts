import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NewUser, User } from "@/types/db";

// =========================================================
// İstifadəçi Sorğuları
// =========================================================

/**
 * Clerk ID ilə istifadəçini tap
 */
export async function getUserByClerkId(
  clerkId: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result[0];
}

/**
 * Email ilə istifadəçini tap
 */
export async function getUserByEmail(
  email: string
): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0];
}

/**
 * ID ilə istifadəçini tap
 */
export async function getUserById(id: string): Promise<User | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result[0];
}

/**
 * Yeni istifadəçi yarat (Clerk webhook-dan çağırılır)
 */
export async function createUser(data: NewUser): Promise<User> {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

/**
 * İstifadəçi məlumatlarını yenilə
 */
export async function updateUser(
  clerkId: string,
  data: Partial<Pick<User, "email" | "fullName" | "avatarUrl" | "lastLoginAt">>
): Promise<User | undefined> {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning();

  return result[0];
}

/**
 * İstifadəçini sil (Clerk webhook-dan çağırılır)
 */
export async function deleteUser(clerkId: string): Promise<void> {
  await db.delete(users).where(eq(users.clerkId, clerkId));
}

/**
 * İstifadəçinin credit balansını əldə et
 */
export async function getUserCreditsBalance(
  clerkId: string
): Promise<number> {
  const user = await getUserByClerkId(clerkId);
  return user?.creditsBalance ?? 0;
}
