import { type NextRequest, NextResponse } from "next/server"
import { db, schema, eq, desc, sql } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"

// API key validation (same as in rules route)
async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return null
  }

  const key = await db.query.apiKeys.findFirst({
    where: eq(schema.apiKeys.key, apiKey) && eq(schema.apiKeys.isActive, true),
    with: {
      createdBy: true,
    },
  })

  if (!key) {
    return null
  }

  // Update last used timestamp
  await db.update(schema.apiKeys).set({ lastUsedAt: new Date() }).where(eq(schema.apiKeys.id, key.id))

  return key
}

// GET handler for compliance status
export async function GET(request: NextRequest) {
  try {
    const apiKey = await validateApiKey(request)

    if (!apiKey) {
      await createAuditLog({
        action: "unauthorized_access",
        details: "Unauthorized API access attempt to /api/compliance",
        severity: "warning",
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the latest compliance check
    const latestCheck = await db.query.complianceChecks.findFirst({
      orderBy: [desc(schema.complianceChecks.createdAt)],
    })

    // Get open alerts count
    const openAlertsCount = await db
      .select({ count: sql`count(*)` })
      .from(schema.complianceAlerts)
      .where(eq(schema.complianceAlerts.status, "open"))

    const alertCount = openAlertsCount[0]?.count || 0

    // Create audit log
    await createAuditLog({
      action: "api_access",
      details: `API access to compliance status by ${apiKey.createdBy.name}`,
      userId: apiKey.createdById,
    })

    return NextResponse.json({
      score: latestCheck?.score || 0,
      lastChecked: latestCheck?.createdAt || null,
      openAlerts: alertCount,
      status: latestCheck?.score >= 80 ? "compliant" : "non-compliant",
    })
  } catch (error) {
    console.error("Error in compliance API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
