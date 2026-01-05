import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  if (pathname === "/login") {
    return NextResponse.next()
  }

  // Protected routes - require authentication
  if (pathname.startsWith("/dashboard") || (pathname.startsWith("/api") && !pathname.startsWith("/api/auth/login"))) {
    const token = request.cookies.get("auth-token")

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const session = await verifyToken(token.value)

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
