import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/headers") {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const apiKey = request.headers.get("x-api-key")

    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: "API key is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
