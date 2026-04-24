import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const isProtectedPath = pathname.startsWith("/dashboard");
  // Paths that should not be accessible if authenticated
  const isAuthPath = pathname.startsWith("/auth");

  if (isProtectedPath || isAuthPath) {
    const sessionResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    const session = await sessionResponse.json();

    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    if (isAuthPath && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
