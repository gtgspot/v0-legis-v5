import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { compare, hash } from "bcryptjs"
import { createId } from "@paralleldrive/cuid2"
import { db, schema, eq } from "./db"
import { addDays } from "date-fns"

// Session cookie name
const SESSION_COOKIE_NAME = "aulcaf_session"

// Function to hash a password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

// Function to verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Function to create a session
export async function createSession(userId: string, userAgent?: string, ip?: string) {
  const sessionId = createId()
  const expiresAt = addDays(new Date(), 7)

  await db.insert(schema.sessions).values({
    id: sessionId,
    userId,
    expiresAt,
    userAgent,
    ip,
  })

  cookies().set({
    name: SESSION_COOKIE_NAME,
    value: sessionId,
    expires: expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  })

  return sessionId
}

// Function to get the current session
export async function getSession() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value

  if (!sessionId) {
    return null
  }

  const session = await db.query.sessions.findFirst({
    where: eq(schema.sessions.id, sessionId),
    with: {
      user: true,
    },
  })

  if (!session || new Date(session.expiresAt) < new Date()) {
    cookies().delete(SESSION_COOKIE_NAME)
    return null
  }

  return session
}

// Function to get the current user
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user || null
}

// Function to require authentication
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

// Function to require a specific role
export async function requireRole(roles: string | string[]) {
  const user = await requireAuth()
  const allowedRoles = Array.isArray(roles) ? roles : [roles]

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized")
  }

  return user
}

// Function to log out
export async function logout() {
  const sessionId = cookies().get(SESSION_COOKIE_NAME)?.value

  if (sessionId) {
    await db.delete(schema.sessions).where(eq(schema.sessions.id, sessionId))
    cookies().delete(SESSION_COOKIE_NAME)
  }
}
