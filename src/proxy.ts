import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  let user: { role?: string } | null = null;

  try {
    const origin = request.nextUrl.origin;
    const sessionRes = await fetch(`${origin}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (sessionRes.ok) {
      const session = await sessionRes.json();
      user = session?.user ?? null;
    }
  } catch {
    // Network error — pass through rather than wrongly bounce to /login
    return NextResponse.next();
  }

  const role = (user as { role?: string })?.role ?? "";
  const isAuthenticated = !!user;

  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(pathName);

  // 1. If authenticated and trying to access login/register → redirect to home
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. If NOT authenticated and trying to access protected routes → redirect to login
  // (We skip this if they are already on an auth page to avoid infinite loops)
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role-based access control for authenticated users
  if (isAuthenticated) {
    // Customer trying to access instructor routes
    if (role === "CUSTOMER" && pathName.startsWith("/instructor")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Customer trying to access admin routes
    if (role === "CUSTOMER" && pathName.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Instructor trying to access admin routes
    if (role === "INSTRUCTOR" && pathName.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/instructor/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Authentication and role-based route protection
export const config = {
  matcher: [
    "/login",
    "/register",
    "/cart",
    "/orders/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/instructor/:path*",
    "/admin/:path*",
  ],
};
