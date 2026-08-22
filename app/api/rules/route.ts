import { type NextRequest, NextResponse } from "next/server"
import { db, schema, eq } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { z } from "zod"
import { and } from "drizzle-orm"

// API key validation
async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return null
  }

  const key = await db.query.apiKeys.findFirst({
    where: and(eq(schema.apiKeys.key, apiKey), eq(schema.apiKeys.isActive, true)),
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

// GET handler for rules
export async function GET(request: NextRequest) {
  try {
    const apiKey = await validateApiKey(request)

    if (!apiKey) {
      await createAuditLog({
        action: "unauthorized_access",
        details: "Unauthorized API access attempt to /api/rules",
        severity: "warning",
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const status = searchParams.get("status")

    // Build query
    let query = db.select().from(schema.rules)

    if (category) {
      query = query.where(eq(schema.rules.category, category))
    }

    if (status) {
      query = query.where(eq(schema.rules.status, status))
    }

    // Only return public rules
    query = query.where(eq(schema.rules.isPublic, true))

    // Execute query
    const rules = await query

    // Create audit log
    await createAuditLog({
      action: "api_access",
      details: `API access to rules by ${apiKey.createdBy.name}`,
      userId: apiKey.createdById,
    })

    return NextResponse.json({ rules })
  } catch (error) {
    console.error("Error in rules API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST handler for rule validation
export async function POST(request: NextRequest) {
  try {
    const apiKey = await validateApiKey(request)

    if (!apiKey) {
      await createAuditLog({
        action: "unauthorized_access",
        details: "Unauthorized API access attempt to /api/rules",
        severity: "warning",
      })

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Validate request body
    const schema = z.object({
      data: z.record(z.any()),
      rules: z.array(z.string()).optional(),
    })

    const validationResult = schema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid request body", details: validationResult.error }, { status: 400 })
    }

    const { data, rules: ruleIds } = validationResult.data

    // Get rules to validate against
    let rulesToCheck = await db.query.rules.findMany({
      where: and(eq(schema.rules.isPublic, true), eq(schema.rules.status, "active")),
    })

    // Filter by rule IDs if provided
    if (ruleIds && ruleIds.length > 0) {
      rulesToCheck = rulesToCheck.filter((rule) => ruleIds.includes(rule.id))
    }

    // Mock rule validation logic
    // In a real implementation, this would evaluate each rule against the provided data
    const results = rulesToCheck.map((rule) => {
      // Simple mock validation based on rule ID
      const isCompliant = rule.id.includes("PRIV")
        ? data.hasOwnProperty("consent") && data.consent === true
        : Math.random() > 0.2 // 80% chance of compliance for other rules

      return {
        ruleId: rule.id,
        compliant: isCompliant,
        details: isCompliant
          ? `Data complies with rule "${rule.title}"`
          : `Data does not comply with rule "${rule.title}"`,
      }
    })

    // Calculate overall compliance
    const compliantCount = results.filter((r) => r.compliant).length
    const overallCompliance = (compliantCount / results.length) * 100

    // Create audit log
    await createAuditLog({
      action: "api_validation",
      details: `API validation request by ${apiKey.createdBy.name} with ${compliantCount}/${results.length} rules passing`,
      userId: apiKey.createdById,
    })

    return NextResponse.json({
      results,
      overallCompliance: Math.round(overallCompliance),
      compliantRules: compliantCount,
      totalRules: results.length,
    })
  } catch (error) {
    console.error("Error in rules validation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
