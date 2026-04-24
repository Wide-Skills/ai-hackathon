import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic check: just check for the presence of the session cookie
  // Better Auth default cookie name is better-auth.session_token
  const sessionToken = request.cookies.get("better-auth.session_token");

  const isProtectedPath = pathname.startsWith("/dashboard");
  const isAuthPath = pathname.startsWith("/auth");

  if (isProtectedPath && !sessionToken) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthPath && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Broad matcher excluding internal paths and assets, as recommended for auth
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
