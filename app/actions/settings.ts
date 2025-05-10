"use server"

import { revalidatePath } from "next/cache"
import { db, schema, eq } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { requireRole } from "@/lib/auth"

// Function to update settings
export async function updateSettings(category: string, settings: Record<string, any>) {
  const user = await requireRole(["admin"])

  try {
    // Update each setting
    for (const [key, value] of Object.entries(settings)) {
      // Check if setting exists
      const existingSetting = await db.query.settings.findFirst({
        where: eq(schema.settings.category, category) && eq(schema.settings.key, key),
      })

      if (existingSetting) {
        // Update existing setting
        await db
          .update(schema.settings)
          .set({
            value,
            updatedAt: new Date(),
          })
          .where(eq(schema.settings.id, existingSetting.id))
      } else {
        // Create new setting
        await db.insert(schema.settings).values({
          category,
          key,
          value,
        })
      }
    }

    // Create audit log
    await createAuditLog({
      action: "settings_update",
      details: `Updated ${category} settings`,
      entityType: "settings",
      entityId: category,
      userId: user.id,
    })

    // Revalidate settings page
    revalidatePath("/cms")

    return { success: true }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}

// Function to get settings
export async function getSettings(category: string) {
  await requireRole(["admin", "editor", "viewer"])

  try {
    const settings = await db.query.settings.findMany({
      where: eq(schema.settings.category, category),
    })

    // Convert to key-value object
    const settingsObject = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, any>,
    )

    return { success: true, settings: settingsObject }
  } catch (error) {
    console.error("Error getting settings:", error)
    return { success: false, error: "Failed to get settings" }
  }
}
