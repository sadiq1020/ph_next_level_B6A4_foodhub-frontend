import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  //  Must use process.env here - edge runtime limitation
  const sessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const session = await sessionRes.json();
  const user = session?.user;
  const role = (user as { role?: string })?.role ?? "";
  const isAuthenticated = !!user;

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Customer trying to access provider routes
  if (role === "CUSTOMER" && pathName.startsWith("/provider")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Customer trying to access admin routes
  if (role === "CUSTOMER" && pathName.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Provider trying to access admin routes
  if (role === "PROVIDER" && pathName.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/provider/dashboard", request.url));
  }

  return NextResponse.next();
}

// ✅ Protected routes — /cart intentionally excluded.
// Cart is client-side only (Zustand + localStorage), has no server data,
// and including it caused a race condition where the proxy redirected
// authenticated users to /login due to session cookie timing.
// The cart page itself handles auth client-side via useSession().
export const config = {
  matcher: [
    "/orders/:path*",
    "/checkout/:path*",
    "/profile/:path*",
    "/provider/:path*",
    "/admin/:path*",
  ],
};
