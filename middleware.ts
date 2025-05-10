import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Check for API key
  const apiKey = request.headers.get("x-api-key")

  // If no API key is provided, return 401
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "API key is required" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  // Continue with the request
  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
