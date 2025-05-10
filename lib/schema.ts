import { pgTable, text, timestamp, boolean, integer, json, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "viewer"])
export const auditSeverityEnum = pgEnum("audit_severity", ["info", "warning", "error", "critical"])
export const complianceStatusEnum = pgEnum("compliance_status", ["compliant", "non_compliant", "warning", "pending"])
export const ruleTypeEnum = pgEnum("rule_type", [
  "privacy",
  "security",
  "data_retention",
  "consent",
  "notification",
  "other",
])

// Users table
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Sessions table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ip: text("ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Legal sources table
export const legalSources = pgTable("legal_sources", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url"),
  type: text("type").notNull(), // Act, Regulation, Case Law, etc.
  jurisdiction: text("jurisdiction").notNull(), // Federal, State, etc.
  year: integer("year"),
  citation: text("citation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Rules table
export const rules = pgTable("rules", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  type: ruleTypeEnum("type").notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(0),
  createdById: text("created_by_id").references(() => users.id),
  updatedById: text("updated_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Rule versions table
export const ruleVersions = pgTable("rule_versions", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  ruleId: text("rule_id")
    .notNull()
    .references(() => rules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: ruleTypeEnum("type").notNull(),
  content: text("content").notNull(),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  version: integer("version").notNull(),
})

// Rule legal sources table (many-to-many)
export const ruleLegalSources = pgTable("rule_legal_sources", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  ruleId: text("rule_id")
    .notNull()
    .references(() => rules.id, { onDelete: "cascade" }),
  legalSourceId: text("legal_source_id")
    .notNull()
    .references(() => legalSources.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Compliance checks table
export const complianceChecks = pgTable("compliance_checks", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  ruleId: text("rule_id")
    .notNull()
    .references(() => rules.id, { onDelete: "cascade" }),
  status: complianceStatusEnum("status").notNull(),
  details: text("details"),
  checkedById: text("checked_by_id").references(() => users.id),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
})

// Audit logs table
export const auditLogs = pgTable("audit_logs", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  details: json("details"),
  severity: auditSeverityEnum("severity").notNull().default("info"),
  userId: text("user_id").references(() => users.id),
  userAgent: text("user_agent"),
  ip: text("ip"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Settings table
export const settings = pgTable("settings", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  updatedById: text("updated_by_id").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// API keys table
export const apiKeys = pgTable("api_keys", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  createdById: text("created_by_id").references(() => users.id),
  expiresAt: timestamp("expires_at"),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  createdRules: many(rules, { relationName: "createdRules" }),
  updatedRules: many(rules, { relationName: "updatedRules" }),
  complianceChecks: many(complianceChecks),
  auditLogs: many(auditLogs),
  updatedSettings: many(settings),
  apiKeys: many(apiKeys),
}))

export const rulesRelations = relations(rules, ({ one, many }) => ({
  createdBy: one(users, { fields: [rules.createdById], references: [users.id], relationName: "createdRules" }),
  updatedBy: one(users, { fields: [rules.updatedById], references: [users.id], relationName: "updatedRules" }),
  versions: many(ruleVersions),
  legalSources: many(ruleLegalSources),
  complianceChecks: many(complianceChecks),
}))

export const legalSourcesRelations = relations(legalSources, ({ many }) => ({
  rules: many(ruleLegalSources),
}))

export const ruleLegalSourcesRelations = relations(ruleLegalSources, ({ one }) => ({
  rule: one(rules, { fields: [ruleLegalSources.ruleId], references: [rules.id] }),
  legalSource: one(legalSources, { fields: [ruleLegalSources.legalSourceId], references: [legalSources.id] }),
}))

export const ruleVersionsRelations = relations(ruleVersions, ({ one }) => ({
  rule: one(rules, { fields: [ruleVersions.ruleId], references: [rules.id] }),
  createdBy: one(users, { fields: [ruleVersions.createdById], references: [users.id] }),
}))

export const complianceChecksRelations = relations(complianceChecks, ({ one }) => ({
  rule: one(rules, { fields: [complianceChecks.ruleId], references: [rules.id] }),
  checkedBy: one(users, { fields: [complianceChecks.checkedById], references: [users.id] }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}))

export const settingsRelations = relations(settings, ({ one }) => ({
  updatedBy: one(users, { fields: [settings.updatedById], references: [users.id] }),
}))

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  createdBy: one(users, { fields: [apiKeys.createdById], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))
