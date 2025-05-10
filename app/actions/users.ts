"use server"

import { revalidatePath } from "next/cache"
import { db, schema, eq } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { requireRole, hashPassword } from "@/lib/auth"
import { z } from "zod"
import { createId } from "@paralleldrive/cuid2"

// Validation schema for user creation
const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "editor", "viewer"]),
})

// Validation schema for user update
const updateUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"]),
  password: z.string().min(8).optional(),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
export type UpdateUserFormData = z.infer<typeof updateUserSchema>

// Function to create a new user
export async function createUser(formData: CreateUserFormData) {
  const currentUser = await requireRole(["admin"])

  try {
    // Validate the form data
    const validatedData = createUserSchema.parse(formData)

    // Check if email already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, validatedData.email),
    })

    if (existingUser) {
      return { success: false, error: "A user with this email already exists" }
    }

    // Hash the password
    const passwordHash = await hashPassword(validatedData.password)

    // Create the user
    const userId = createId()
    await db.insert(schema.users).values({
      id: userId,
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
      role: validatedData.role,
    })

    // Create audit log
    await createAuditLog({
      action: "user_create",
      details: `Created user ${validatedData.name} (${validatedData.email}) with role ${validatedData.role}`,
      entityType: "user",
      entityId: userId,
      userId: currentUser.id,
    })

    // Revalidate the users page
    revalidatePath("/cms")

    return { success: true, userId }
  } catch (error) {
    console.error("Error creating user:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error", details: error.errors }
    }

    return { success: false, error: "Failed to create user" }
  }
}

// Function to update an existing user
export async function updateUser(userId: string, formData: UpdateUserFormData) {
  const currentUser = await requireRole(["admin"])

  try {
    // Validate the form data
    const validatedData = updateUserSchema.parse(formData)

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!existingUser) {
      return { success: false, error: "User not found" }
    }

    // Check if email is already used by another user
    if (validatedData.email !== existingUser.email) {
      const emailExists = await db.query.users.findFirst({
        where: eq(schema.users.email, validatedData.email),
      })

      if (emailExists) {
        return { success: false, error: "Email is already in use" }
      }
    }

    // Prepare update data
    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      updatedAt: new Date(),
    }

    // Hash the password if provided
    if (validatedData.password) {
      updateData.passwordHash = await hashPassword(validatedData.password)
    }

    // Update the user
    await db.update(schema.users).set(updateData).where(eq(schema.users.id, userId))

    // Create audit log
    await createAuditLog({
      action: "user_update",
      details: `Updated user ${validatedData.name} (${validatedData.email})`,
      entityType: "user",
      entityId: userId,
      userId: currentUser.id,
    })

    // Revalidate the users page
    revalidatePath("/cms")

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error", details: error.errors }
    }

    return { success: false, error: "Failed to update user" }
  }
}

// Function to delete a user
export async function deleteUser(userId: string) {
  const currentUser = await requireRole(["admin"])

  try {
    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    })

    if (!existingUser) {
      return { success: false, error: "User not found" }
    }

    // Prevent deleting yourself
    if (userId === currentUser.id) {
      return { success: false, error: "You cannot delete your own account" }
    }

    // Delete the user
    await db.delete(schema.users).where(eq(schema.users.id, userId))

    // Create audit log
    await createAuditLog({
      action: "user_delete",
      details: `Deleted user ${existingUser.name} (${existingUser.email})`,
      entityType: "user",
      entityId: userId,
      userId: currentUser.id,
      severity: "warning",
    })

    // Revalidate the users page
    revalidatePath("/cms")

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
