import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  bigint,
  numeric,
  jsonb,
  index,
  unique,
  check,
  date,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// =========================================================
// ENUM TYPES
// =========================================================

export const userRoleEnum = pgEnum("user_role", ["user", "admin", "owner"]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
  "unpaid",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "starter",
  "pro",
  "business",
]);

export const generationTypeEnum = pgEnum("generation_type", [
  "image_generation",
  "image_to_image",
  "video_generation",
  "video_editing",
  "background_removal",
  "upscale",
  "object_removal",
]);

export const generationStatusEnum = pgEnum("generation_status", [
  "queued",
  "processing",
  "completed",
  "failed",
]);

export const creditTransactionTypeEnum = pgEnum("credit_transaction_type", [
  "purchase",
  "subscription_grant",
  "usage",
  "refund",
  "bonus",
  "admin_adjustment",
]);

export const teamMemberRoleEnum = pgEnum("team_member_role", [
  "owner",
  "admin",
  "editor",
  "viewer",
]);

export const fileTypeEnum = pgEnum("file_type", [
  "image",
  "video",
  "audio",
  "other",
]);

// =========================================================
// USERS (Clerk ilə sync olunur)
// =========================================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("user"),
  creditsBalance: integer("credits_balance").notNull().default(0),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

// =========================================================
// TEAMS / WORKSPACES
// =========================================================

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    logoUrl: text("logo_url"),
    creditsBalance: integer("credits_balance").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_teams_owner").on(table.ownerId)]
);

// =========================================================
// TEAM MEMBERS
// =========================================================

export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: teamMemberRoleEnum("role").notNull().default("editor"),
    invitedBy: uuid("invited_by").references(() => users.id),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_team_members_team").on(table.teamId),
    index("idx_team_members_user").on(table.userId),
    unique("team_members_team_id_user_id_unique").on(
      table.teamId,
      table.userId
    ),
  ]
);

// =========================================================
// TEAM INVITES
// =========================================================

export const teamInvites = pgTable(
  "team_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: teamMemberRoleEnum("role").notNull().default("editor"),
    token: text("token").notNull().unique(),
    invitedBy: uuid("invited_by")
      .notNull()
      .references(() => users.id),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_team_invites_token").on(table.token)]
);

// =========================================================
// STRIPE SUBSCRIPTIONS
// =========================================================

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "cascade",
    }),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    plan: subscriptionPlanEnum("plan").notNull().default("free"),
    status: subscriptionStatusEnum("status").notNull().default("active"),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end")
      .notNull()
      .default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_subscriptions_user").on(table.userId),
    index("idx_subscriptions_team").on(table.teamId),
    check(
      "subscriptions_user_or_team_check",
      sql`${table.userId} IS NOT NULL OR ${table.teamId} IS NOT NULL`
    ),
  ]
);

// =========================================================
// CREDIT PACKS
// =========================================================

export const creditPacks = pgTable("credit_packs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  credits: integer("credits").notNull(),
  priceCents: integer("price_cents").notNull(),
  stripePriceId: text("stripe_price_id").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =========================================================
// PROJECTS
// =========================================================

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull().default("Untitled Project"),
    description: text("description"),
    coverFileId: uuid("cover_file_id"), // FK əlavə olunur files cədvəlindən sonra
    isArchived: boolean("is_archived").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_projects_user").on(table.userId),
    index("idx_projects_team").on(table.teamId),
  ]
);

// =========================================================
// FILE STORAGE (ImageKit metadata)
// =========================================================

export const files = pgTable(
  "files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    imagekitFileId: text("imagekit_file_id").notNull().unique(),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    fileName: text("file_name").notNull(),
    fileType: fileTypeEnum("file_type").notNull(),
    mimeType: text("mime_type"),
    sizeBytes: bigint("size_bytes", { mode: "number" }),
    width: integer("width"),
    height: integer("height"),
    durationSeconds: numeric("duration_seconds"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_files_user").on(table.userId),
    index("idx_files_project").on(table.projectId),
  ]
);

// =========================================================
// AI GENERATIONS (History)
// =========================================================

export const generations = pgTable(
  "generations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "cascade",
    }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    type: generationTypeEnum("type").notNull(),
    status: generationStatusEnum("status").notNull().default("queued"),
    prompt: text("prompt"),
    inputFileId: uuid("input_file_id").references(() => files.id, {
      onDelete: "set null",
    }),
    outputFileId: uuid("output_file_id").references(() => files.id, {
      onDelete: "set null",
    }),
    provider: text("provider"),
    modelName: text("model_name"),
    parameters: jsonb("parameters").default({}),
    creditsCost: integer("credits_cost").notNull().default(0),
    errorMessage: text("error_message"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_generations_user").on(table.userId),
    index("idx_generations_team").on(table.teamId),
    index("idx_generations_project").on(table.projectId),
    index("idx_generations_status").on(table.status),
    index("idx_generations_type").on(table.type),
  ]
);

// =========================================================
// CREDIT TRANSACTIONS (Ledger)
// =========================================================

export const creditTransactions = pgTable(
  "credit_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "cascade",
    }),
    amount: integer("amount").notNull(), // müsbət = əlavə, mənfi = xərc
    balanceAfter: integer("balance_after").notNull(),
    type: creditTransactionTypeEnum("type").notNull(),
    description: text("description"),
    generationId: uuid("generation_id").references(() => generations.id, {
      onDelete: "set null",
    }),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_credit_tx_user").on(table.userId),
    index("idx_credit_tx_team").on(table.teamId),
  ]
);

// =========================================================
// SHARE LINKS
// =========================================================

export const shareLinks = pgTable(
  "share_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    token: text("token")
      .notNull()
      .unique()
      .default(sql`encode(gen_random_bytes(16), 'hex')`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "cascade",
    }),
    generationId: uuid("generation_id").references(() => generations.id, {
      onDelete: "cascade",
    }),
    isPublic: boolean("is_public").notNull().default(true),
    passwordHash: text("password_hash"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    viewCount: integer("view_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "share_links_project_or_generation_check",
      sql`${table.projectId} IS NOT NULL OR ${table.generationId} IS NOT NULL`
    ),
  ]
);

// =========================================================
// ANALYTICS
// =========================================================

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    teamId: uuid("team_id").references(() => teams.id, {
      onDelete: "set null",
    }),
    eventName: text("event_name").notNull(),
    eventData: jsonb("event_data").default({}),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_analytics_event_name").on(table.eventName),
    index("idx_analytics_user").on(table.userId),
    index("idx_analytics_created_at").on(table.createdAt),
  ]
);

export const dailyUsageStats = pgTable("daily_usage_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull().unique(),
  totalGenerations: integer("total_generations").notNull().default(0),
  totalCreditsUsed: integer("total_credits_used").notNull().default(0),
  totalNewUsers: integer("total_new_users").notNull().default(0),
  totalRevenueCents: integer("total_revenue_cents").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// =========================================================
// ADMIN AUDIT LOG
// =========================================================

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => users.id),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: uuid("target_id"),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_admin_logs_admin").on(table.adminId)]
);

// =========================================================
// RELATIONS
// =========================================================

export const usersRelations = relations(users, ({ many }) => ({
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers, { relationName: "member" }),
  invitedMembers: many(teamMembers, { relationName: "inviter" }),
  sentInvites: many(teamInvites),
  subscriptions: many(subscriptions),
  creditTransactions: many(creditTransactions),
  projects: many(projects),
  files: many(files),
  generations: many(generations),
  shareLinks: many(shareLinks),
  analyticsEvents: many(analyticsEvents),
  adminAuditLogs: many(adminAuditLogs),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, { fields: [teams.ownerId], references: [users.id] }),
  members: many(teamMembers),
  invites: many(teamInvites),
  subscriptions: many(subscriptions),
  creditTransactions: many(creditTransactions),
  projects: many(projects),
  generations: many(generations),
  analyticsEvents: many(analyticsEvents),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
    relationName: "member",
  }),
  inviter: one(users, {
    fields: [teamMembers.invitedBy],
    references: [users.id],
    relationName: "inviter",
  }),
}));

export const teamInvitesRelations = relations(teamInvites, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvites.teamId],
    references: [teams.id],
  }),
  inviter: one(users, {
    fields: [teamInvites.invitedBy],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [subscriptions.teamId],
    references: [teams.id],
  }),
}));

export const creditTransactionsRelations = relations(
  creditTransactions,
  ({ one }) => ({
    user: one(users, {
      fields: [creditTransactions.userId],
      references: [users.id],
    }),
    team: one(teams, {
      fields: [creditTransactions.teamId],
      references: [teams.id],
    }),
    generation: one(generations, {
      fields: [creditTransactions.generationId],
      references: [generations.id],
    }),
  })
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
  coverFile: one(files, {
    fields: [projects.coverFileId],
    references: [files.id],
    relationName: "projectCover",
  }),
  files: many(files, { relationName: "projectFiles" }),
  generations: many(generations),
  shareLinks: many(shareLinks),
}));

export const filesRelations = relations(files, ({ one, many }) => ({
  user: one(users, {
    fields: [files.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [files.projectId],
    references: [projects.id],
    relationName: "projectFiles",
  }),
  coverOfProjects: many(projects, { relationName: "projectCover" }),
  generationsAsInput: many(generations, { relationName: "inputFile" }),
  generationsAsOutput: many(generations, { relationName: "outputFile" }),
}));

export const generationsRelations = relations(
  generations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [generations.userId],
      references: [users.id],
    }),
    team: one(teams, {
      fields: [generations.teamId],
      references: [teams.id],
    }),
    project: one(projects, {
      fields: [generations.projectId],
      references: [projects.id],
    }),
    inputFile: one(files, {
      fields: [generations.inputFileId],
      references: [files.id],
      relationName: "inputFile",
    }),
    outputFile: one(files, {
      fields: [generations.outputFileId],
      references: [files.id],
      relationName: "outputFile",
    }),
    creditTransactions: many(creditTransactions),
    shareLinks: many(shareLinks),
  })
);

export const shareLinksRelations = relations(shareLinks, ({ one }) => ({
  user: one(users, {
    fields: [shareLinks.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [shareLinks.projectId],
    references: [projects.id],
  }),
  generation: one(generations, {
    fields: [shareLinks.generationId],
    references: [generations.id],
  }),
}));

export const analyticsEventsRelations = relations(
  analyticsEvents,
  ({ one }) => ({
    user: one(users, {
      fields: [analyticsEvents.userId],
      references: [users.id],
    }),
    team: one(teams, {
      fields: [analyticsEvents.teamId],
      references: [teams.id],
    }),
  })
);

export const adminAuditLogsRelations = relations(
  adminAuditLogs,
  ({ one }) => ({
    admin: one(users, {
      fields: [adminAuditLogs.adminId],
      references: [users.id],
    }),
  })
);
