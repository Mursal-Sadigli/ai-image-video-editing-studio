import { createUser, getUserByClerkId, updateUser } from "@/lib/db/queries/users";
import { grantSignupCredits } from "@/lib/db/queries/credits";
import { FREE_SIGNUP_CREDITS } from "@/config/pricing";

// =========================================================
// Clerk → DB Sync Funksiyaları
// =========================================================

interface ClerkUserData {
  clerkId: string;
  email: string;
  fullName?: string | null;
  avatarUrl?: string | null;
}

/**
 * Clerk-dən gələn istifadəçi datasını DB ilə sync et
 * user.created webhook-dan çağırılır
 */
export async function syncNewUser(data: ClerkUserData) {
  // Əvvəlcə mövcud istifadəçini yoxla (dublikat yaratmamaq üçün)
  const existingUser = await getUserByClerkId(data.clerkId);
  if (existingUser) {
    return existingUser;
  }

  // Yeni istifadəçi yarat
  const newUser = await createUser({
    clerkId: data.clerkId,
    email: data.email,
    fullName: data.fullName ?? null,
    avatarUrl: data.avatarUrl ?? null,
    creditsBalance: FREE_SIGNUP_CREDITS,
  });

  // Başlanğıc pulsuz credit ver (ledger-ə yazı)
  await grantSignupCredits(newUser.id, FREE_SIGNUP_CREDITS);

  return newUser;
}

/**
 * Clerk-dən gələn yeniləmə ilə istifadəçi datasını sync et
 * user.updated webhook-dan çağırılır
 */
export async function syncUpdatedUser(data: ClerkUserData) {
  return updateUser(data.clerkId, {
    email: data.email,
    fullName: data.fullName ?? undefined,
    avatarUrl: data.avatarUrl ?? undefined,
  });
}

/**
 * Clerk-dən gələn session ilə last login yenilə
 */
export async function syncUserLogin(clerkId: string) {
  return updateUser(clerkId, {
    lastLoginAt: new Date(),
  });
}
