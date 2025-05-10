import { db, schema } from "./db"
import { getCurrentUser } from "./auth"
import { headers } from "next/headers"

type AuditAction =
  | "login"
  | "login_failed"
  | "logout"
  | "rule_create"
  | "rule_update"
  | "rule_delete"
  | "user_create"
  | "user_update"
  | "user_delete"
  | "compliance_check"
  | "alert_acknowledge"
  | "alert_resolve"
  | "settings_update"
  | "api_key_create"
  | "api_key_delete"
  | "unauthorized_access"

type AuditSeverity = "info" | "warning" | "critical"

interface AuditLogOptions {
  action: AuditAction
  details: string
  entityType?: string
  entityId?: string
  severity?: AuditSeverity
  userId?: string
}

export async function createAuditLog({
  action,
  details,
  entityType,
  entityId,
  severity = "info",
  userId,
}: AuditLogOptions) {
  const headersList = headers()
  const ip = headersList.get("x-forwarded-for") || "unknown"
  const userAgent = headersList.get("user-agent") || "unknown"

  // If userId is not provided, try to get the current user
  let actualUserId = userId
  if (!actualUserId) {
    const currentUser = await getCurrentUser()
    actualUserId = currentUser?.id
  }

  await db.insert(schema.auditLogs).values({
    userId: actualUserId,
    action,
    details,
    entityType,
    entityId,
    ip,
    userAgent,
    severity,
  })
}
