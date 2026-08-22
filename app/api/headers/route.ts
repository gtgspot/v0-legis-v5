import { type NextRequest, NextResponse } from "next/server"
import { db, schema, eq } from "@/lib/db"
import {
  extractHeaderTokens,
  extractDataLexHeaders,
} from "@/lib/api-headers"
import { and } from "drizzle-orm"

async function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key")

  if (!apiKey) {
    return null
  }

  return db.query.apiKeys.findFirst({
    where: and(eq(schema.apiKeys.key, apiKey), eq(schema.apiKeys.isActive, true)),
  })
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const apiKey = await validateApiKey(request)

  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const safeHeaders = {
    accept: extractHeaderTokens(request.headers, "accept"),
    contentType: extractHeaderTokens(request.headers, "content-type"),
    userAgent: extractHeaderTokens(request.headers, "user-agent"),
  }

  // Extract DataLex specific headers
  const dataLexHeaders = extractDataLexHeaders(request.headers)

  return NextResponse.json({
    safeHeaders,
    dataLexHeaders,
  })
}
