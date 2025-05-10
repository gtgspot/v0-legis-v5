"use server"

import { revalidatePath } from "next/cache"
import { db, schema, eq, withTransaction } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { requireRole } from "@/lib/auth"
import { z } from "zod"

// Validation schema for rule creation/update
const ruleSchema = z.object({
  id: z.string().min(1).max(20),
  title: z.string().min(1).max(255),
  source: z.string().min(1).max(255),
  condition: z.string().min(1),
  requirement: z.string().min(1),
  consequence: z.string().min(1),
  enforcement: z.string().optional(),
  category: z.enum(["privacy", "consumer", "security", "safety"]),
  status: z.enum(["active", "draft", "archived"]),
  isPublic: z.boolean().default(true),
  legalSources: z
    .array(
      z.object({
        id: z.string().optional(),
        type: z.enum(["legislation", "case", "guidance"]),
        title: z.string().min(1),
        sections: z.string().optional(),
        citation: z.string().optional(),
        url: z.string().url().optional(),
      }),
    )
    .optional(),
})

export type RuleFormData = z.infer<typeof ruleSchema>

// Function to create a new rule
export async function createRule(formData: RuleFormData) {
  const user = await requireRole(["admin", "editor"])

  try {
    // Validate the form data
    const validatedData = ruleSchema.parse(formData)

    // Check if rule ID already exists
    const existingRule = await db.query.rules.findFirst({
      where: eq(schema.rules.id, validatedData.id),
    })

    if (existingRule) {
      return { success: false, error: "A rule with this ID already exists" }
    }

    // Use a transaction to ensure all operations succeed or fail together
    await withTransaction(async (client) => {
      const drizzleClient = db.drizzle(client)

      // Insert the rule
      await drizzleClient.insert(schema.rules).values({
        ...validatedData,
        createdById: user.id,
        updatedById: user.id,
      })

      // Insert legal sources if provided
      if (validatedData.legalSources && validatedData.legalSources.length > 0) {
        for (const source of validatedData.legalSources) {
          // Check if the legal source already exists
          let legalSourceId = source.id

          if (!legalSourceId) {
            // Create a new legal source
            const [newSource] = await drizzleClient
              .insert(schema.legalSources)
              .values({
                type: source.type,
                title: source.title,
                sections: source.sections,
                citation: source.citation,
                url: source.url,
              })
              .returning({ id: schema.legalSources.id })

            legalSourceId = newSource.id
          }

          // Create the relationship
          await drizzleClient.insert(schema.ruleLegalSources).values({
            ruleId: validatedData.id,
            legalSourceId,
          })
        }
      }

      // Create rule history entry
      await drizzleClient.insert(schema.ruleHistory).values({
        ruleId: validatedData.id,
        userId: user.id,
        changeType: "create",
        changes: validatedData,
      })
    })

    // Create audit log
    await createAuditLog({
      action: "rule_create",
      details: `Created rule ${validatedData.id}: ${validatedData.title}`,
      entityType: "rule",
      entityId: validatedData.id,
      userId: user.id,
    })

    // Revalidate the rules page
    revalidatePath("/rules")
    revalidatePath("/")

    return { success: true, ruleId: validatedData.id }
  } catch (error) {
    console.error("Error creating rule:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error", details: error.errors }
    }

    return { success: false, error: "Failed to create rule" }
  }
}

// Function to update an existing rule
export async function updateRule(ruleId: string, formData: RuleFormData) {
  const user = await requireRole(["admin", "editor"])

  try {
    // Validate the form data
    const validatedData = ruleSchema.parse(formData)

    // Check if rule exists
    const existingRule = await db.query.rules.findFirst({
      where: eq(schema.rules.id, ruleId),
      with: {
        legalSources: {
          with: {
            legalSource: true,
          },
        },
      },
    })

    if (!existingRule) {
      return { success: false, error: "Rule not found" }
    }

    // Use a transaction to ensure all operations succeed or fail together
    await withTransaction(async (client) => {
      const drizzleClient = db.drizzle(client)

      // Update the rule
      await drizzleClient
        .update(schema.rules)
        .set({
          ...validatedData,
          updatedById: user.id,
          updatedAt: new Date(),
        })
        .where(eq(schema.rules.id, ruleId))

      // Handle legal sources
      if (validatedData.legalSources) {
        // Get existing legal source IDs
        const existingSourceIds = existingRule.legalSources.map((source) => source.legalSourceId)

        // Delete removed relationships
        if (existingSourceIds.length > 0) {
          const newSourceIds = validatedData.legalSources
            .filter((source) => source.id)
            .map((source) => source.id as string)

          const removedSourceIds = existingSourceIds.filter((id) => !newSourceIds.includes(id))

          if (removedSourceIds.length > 0) {
            await drizzleClient
              .delete(schema.ruleLegalSources)
              .where(
                eq(schema.ruleLegalSources.ruleId, ruleId) &&
                  eq(schema.ruleLegalSources.legalSourceId, removedSourceIds[0]),
              )
          }
        }

        // Add new legal sources
        for (const source of validatedData.legalSources) {
          let legalSourceId = source.id

          if (!legalSourceId) {
            // Create a new legal source
            const [newSource] = await drizzleClient
              .insert(schema.legalSources)
              .values({
                type: source.type,
                title: source.title,
                sections: source.sections,
                citation: source.citation,
                url: source.url,
              })
              .returning({ id: schema.legalSources.id })

            legalSourceId = newSource.id
          } else if (!existingSourceIds.includes(legalSourceId)) {
            // Create the relationship if it doesn't exist
            await drizzleClient.insert(schema.ruleLegalSources).values({
              ruleId,
              legalSourceId,
            })
          }
        }
      }

      // Create rule history entry
      await drizzleClient.insert(schema.ruleHistory).values({
        ruleId,
        userId: user.id,
        changeType: "update",
        changes: validatedData,
      })
    })

    // Create audit log
    await createAuditLog({
      action: "rule_update",
      details: `Updated rule ${ruleId}: ${validatedData.title}`,
      entityType: "rule",
      entityId: ruleId,
      userId: user.id,
    })

    // Revalidate the rules page
    revalidatePath("/rules")
    revalidatePath(`/rules/${ruleId}`)
    revalidatePath("/")

    return { success: true, ruleId }
  } catch (error) {
    console.error("Error updating rule:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error", details: error.errors }
    }

    return { success: false, error: "Failed to update rule" }
  }
}

// Function to delete a rule
export async function deleteRule(ruleId: string) {
  const user = await requireRole(["admin"])

  try {
    // Check if rule exists
    const existingRule = await db.query.rules.findFirst({
      where: eq(schema.rules.id, ruleId),
    })

    if (!existingRule) {
      return { success: false, error: "Rule not found" }
    }

    // Use a transaction to ensure all operations succeed or fail together
    await withTransaction(async (client) => {
      const drizzleClient = db.drizzle(client)

      // Create rule history entry before deletion
      await drizzleClient.insert(schema.ruleHistory).values({
        ruleId,
        userId: user.id,
        changeType: "delete",
        changes: existingRule,
      })

      // Delete the rule (cascade will handle related records)
      await drizzleClient.delete(schema.rules).where(eq(schema.rules.id, ruleId))
    })

    // Create audit log
    await createAuditLog({
      action: "rule_delete",
      details: `Deleted rule ${ruleId}: ${existingRule.title}`,
      entityType: "rule",
      entityId: ruleId,
      userId: user.id,
      severity: "warning",
    })

    // Revalidate the rules page
    revalidatePath("/rules")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting rule:", error)
    return { success: false, error: "Failed to delete rule" }
  }
}

// Function to get rule history
export async function getRuleHistory(ruleId: string) {
  await requireRole(["admin", "editor", "viewer"])

  try {
    const history = await db.query.ruleHistory.findMany({
      where: eq(schema.ruleHistory.ruleId, ruleId),
      with: {
        user: true,
      },
      orderBy: [schema.ruleHistory.createdAt, "desc"],
    })

    return { success: true, history }
  } catch (error) {
    console.error("Error fetching rule history:", error)
    return { success: false, error: "Failed to fetch rule history" }
  }
}
