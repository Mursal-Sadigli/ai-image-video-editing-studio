import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  users,
  teams,
  teamMembers,
  teamInvites,
  subscriptions,
  creditTransactions,
  creditPacks,
  projects,
  files,
  generations,
  shareLinks,
  analyticsEvents,
  dailyUsageStats,
  adminAuditLogs,
} from "@/lib/db/schema";

// =========================================================
// Select Types (DB-dən oxumaq üçün)
// =========================================================

export type User = InferSelectModel<typeof users>;
export type Team = InferSelectModel<typeof teams>;
export type TeamMember = InferSelectModel<typeof teamMembers>;
export type TeamInvite = InferSelectModel<typeof teamInvites>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type CreditTransaction = InferSelectModel<typeof creditTransactions>;
export type CreditPack = InferSelectModel<typeof creditPacks>;
export type Project = InferSelectModel<typeof projects>;
export type FileRecord = InferSelectModel<typeof files>;
export type Generation = InferSelectModel<typeof generations>;
export type ShareLink = InferSelectModel<typeof shareLinks>;
export type AnalyticsEvent = InferSelectModel<typeof analyticsEvents>;
export type DailyUsageStat = InferSelectModel<typeof dailyUsageStats>;
export type AdminAuditLog = InferSelectModel<typeof adminAuditLogs>;

// =========================================================
// Insert Types (DB-yə yazmaq üçün)
// =========================================================

export type NewUser = InferInsertModel<typeof users>;
export type NewTeam = InferInsertModel<typeof teams>;
export type NewTeamMember = InferInsertModel<typeof teamMembers>;
export type NewTeamInvite = InferInsertModel<typeof teamInvites>;
export type NewSubscription = InferInsertModel<typeof subscriptions>;
export type NewCreditTransaction = InferInsertModel<typeof creditTransactions>;
export type NewCreditPack = InferInsertModel<typeof creditPacks>;
export type NewProject = InferInsertModel<typeof projects>;
export type NewFile = InferInsertModel<typeof files>;
export type NewGeneration = InferInsertModel<typeof generations>;
export type NewShareLink = InferInsertModel<typeof shareLinks>;
export type NewAnalyticsEvent = InferInsertModel<typeof analyticsEvents>;
export type NewDailyUsageStat = InferInsertModel<typeof dailyUsageStats>;
export type NewAdminAuditLog = InferInsertModel<typeof adminAuditLogs>;
