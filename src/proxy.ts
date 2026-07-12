import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoute = [
    "/",
    "/login",
    "/register",
    "/api/auth",
    "/favicon.ico",
    "/_next",
  ];
  // allow alkarega ye sab route ko acces ke liya bina login ke
  if (publicRoute.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const session = await auth();
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  } else {
    return NextResponse.next();
  }
}

// insab ko allow karega without authentication
export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|api/auth/signin/google).*)",
  ],
};
