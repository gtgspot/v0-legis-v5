"use server"

import { revalidatePath } from "next/cache"
import { db, schema, eq, desc } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { requireRole } from "@/lib/auth"

// Function to run a compliance check
export async function runComplianceCheck() {
  const user = await requireRole(["admin", "editor"])

  try {
    // Get all active rules
    const rules = await db.query.rules.findMany({
      where: eq(schema.rules.status, "active"),
    })

    // Mock compliance check logic
    // In a real implementation, this would evaluate each rule against the system state
    const results = rules.map((rule) => {
      // Random compliance score between 70 and 100
      const score = Math.floor(Math.random() * 31) + 70

      return {
        ruleId: rule.id,
        compliant: score >= 80,
        score,
        details:
          score >= 80
            ? `Rule "${rule.title}" passed compliance check with score ${score}`
            : `Rule "${rule.title}" failed compliance check with score ${score}`,
      }
    })

    // Calculate overall compliance score
    const overallScore = Math.floor(results.reduce((sum, result) => sum + result.score, 0) / results.length)

    // Create compliance check record
    const [check] = await db
      .insert(schema.complianceChecks)
      .values({
        score: overallScore,
        details: results,
        triggeredBy: user.id,
        isAutomatic: false,
      })
      .returning({ id: schema.complianceChecks.id })

    // Create alerts for non-compliant rules
    const nonCompliantResults = results.filter((result) => !result.compliant)

    for (const result of nonCompliantResults) {
      await db.insert(schema.complianceAlerts).values({
        checkId: check.id,
        ruleId: result.ruleId,
        severity: result.score < 70 ? "critical" : "warning",
        message: result.details,
        status: "open",
      })
    }

    // Create audit log
    await createAuditLog({
      action: "compliance_check",
      details: `Manual compliance check completed with score ${overallScore}%`,
      entityType: "compliance_check",
      entityId: check.id,
      userId: user.id,
    })

    // Revalidate relevant paths
    revalidatePath("/cms")
    revalidatePath("/")

    return {
      success: true,
      score: overallScore,
      checkId: check.id,
      alerts: nonCompliantResults.length,
    }
  } catch (error) {
    console.error("Error running compliance check:", error)
    return { success: false, error: "Failed to run compliance check" }
  }
}

// Function to acknowledge an alert
export async function acknowledgeAlert(alertId: string) {
  const user = await requireRole(["admin", "editor"])

  try {
    // Check if alert exists
    const alert = await db.query.complianceAlerts.findFirst({
      where: eq(schema.complianceAlerts.id, alertId),
    })

    if (!alert) {
      return { success: false, error: "Alert not found" }
    }

    // Update the alert
    await db
      .update(schema.complianceAlerts)
      .set({
        status: "acknowledged",
        acknowledgedBy: user.id,
        acknowledgedAt: new Date(),
      })
      .where(eq(schema.complianceAlerts.id, alertId))

    // Create audit log
    await createAuditLog({
      action: "alert_acknowledge",
      details: `Acknowledged compliance alert for rule ${alert.ruleId}`,
      entityType: "compliance_alert",
      entityId: alertId,
      userId: user.id,
    })

    // Revalidate relevant paths
    revalidatePath("/cms")

    return { success: true }
  } catch (error) {
    console.error("Error acknowledging alert:", error)
    return { success: false, error: "Failed to acknowledge alert" }
  }
}

// Function to resolve an alert
export async function resolveAlert(alertId: string, resolution: string) {
  const user = await requireRole(["admin", "editor"])

  try {
    // Check if alert exists
    const alert = await db.query.complianceAlerts.findFirst({
      where: eq(schema.complianceAlerts.id, alertId),
    })

    if (!alert) {
      return { success: false, error: "Alert not found" }
    }

    // Update the alert
    await db
      .update(schema.complianceAlerts)
      .set({
        status: "resolved",
        resolvedBy: user.id,
        resolvedAt: new Date(),
      })
      .where(eq(schema.complianceAlerts.id, alertId))

    // Create audit log
    await createAuditLog({
      action: "alert_resolve",
      details: `Resolved compliance alert for rule ${alert.ruleId}: ${resolution}`,
      entityType: "compliance_alert",
      entityId: alertId,
      userId: user.id,
    })

    // Revalidate relevant paths
    revalidatePath("/cms")

    return { success: true }
  } catch (error) {
    console.error("Error resolving alert:", error)
    return { success: false, error: "Failed to resolve alert" }
  }
}

// Function to get compliance status
export async function getComplianceStatus() {
  await requireRole(["admin", "editor", "viewer"])

  try {
    // Get the latest compliance check
    const latestCheck = await db.query.complianceChecks.findFirst({
      orderBy: [desc(schema.complianceChecks.createdAt)],
    })

    // Get open alerts
    const openAlerts = await db.query.complianceAlerts.findMany({
      where: eq(schema.complianceAlerts.status, "open"),
      with: {
        rule: true,
      },
    })

    return {
      success: true,
      score: latestCheck?.score || 0,
      lastChecked: latestCheck?.createdAt || null,
      alerts: openAlerts.length,
      alertDetails: openAlerts,
    }
  } catch (error) {
    console.error("Error getting compliance status:", error)
    return { success: false, error: "Failed to get compliance status" }
  }
}
