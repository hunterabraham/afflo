import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for session token in cookies instead of using auth() function
  const sessionToken =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");
  const hasSession = !!sessionToken;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/auth/setup-company",
    "/api/auth/signup",
    "/api/auth/[...nextauth]",
  ];

  // Routes that require authentication
  const protectedRoutes = ["/dashboard"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Let the login page handle its own redirect logic to avoid loops

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Temporarily disable middleware to test authentication flow
     * Match only specific routes that need protection
     */
    "/dashboard",
  ],
};
