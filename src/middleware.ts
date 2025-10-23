import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "~/server/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/auth/login",
    "/api/auth/signup",
    "/api/auth/[...nextauth]",
  ];

  // Routes that require authentication
  const protectedRoutes = ["/dashboard", "/api/auth/setup-company"];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (pathname === "/auth/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is authenticated but hasn't completed company setup, redirect to setup
  if (session && pathname !== "/auth/setup-company" && !isPublicRoute) {
    // Check if user has completed company setup
    // This is a simplified check - in a real app you might want to check the database
    const hasCompletedSetup = session.user?.id; // This would need to be enhanced

    if (!hasCompletedSetup && pathname !== "/auth/setup-company") {
      return NextResponse.redirect(new URL("/auth/setup-company", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (NextAuth API routes - handled by Node.js runtime)
     */
    "/((?!_next/static|_next/image|favicon.ico|public/|api/auth).*)",
  ],
};
