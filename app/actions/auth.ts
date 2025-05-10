"use server"
import { db, schema, eq } from "@/lib/db"
import { createAuditLog } from "@/lib/audit"
import { verifyPassword, createSession, logout } from "@/lib/auth"
import { z } from "zod"
import { headers } from "next/headers"

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Function to handle login
export async function login(formData: LoginFormData) {
  try {
    // Validate the form data
    const validatedData = loginSchema.parse(formData)

    // Find the user by email
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, validatedData.email),
    })

    if (!user || !user.passwordHash) {
      // Create audit log for failed login
      await createAuditLog({
        action: "login_failed",
        details: `Failed login attempt for ${validatedData.email}`,
        severity: "warning",
      })

      return { success: false, error: "Invalid email or password" }
    }

    // Verify the password
    const passwordValid = await verifyPassword(validatedData.password, user.passwordHash)

    if (!passwordValid) {
      // Create audit log for failed login
      await createAuditLog({
        action: "login_failed",
        details: `Failed login attempt for ${validatedData.email}`,
        severity: "warning",
      })

      return { success: false, error: "Invalid email or password" }
    }

    // Get request headers for audit
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || "unknown"
    const ip = headersList.get("x-forwarded-for") || "unknown"

    // Create a session
    await createSession(user.id, userAgent, ip)

    // Create audit log for successful login
    await createAuditLog({
      action: "login",
      details: `User logged in: ${user.name} (${user.email})`,
      entityType: "user",
      entityId: user.id,
      userId: user.id,
    })

    return { success: true, redirectTo: "/cms" }
  } catch (error) {
    console.error("Error during login:", error)

    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error", details: error.errors }
    }

    return { success: false, error: "Login failed" }
  }
}

// Function to handle logout
export async function handleLogout() {
  try {
    await logout()
    return { success: true }
  } catch (error) {
    console.error("Error during logout:", error)
    return { success: false, error: "Logout failed" }
  }
}
