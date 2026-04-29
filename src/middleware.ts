import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PRIVATE_PATHS, AUTH_PATHS } from "@/config/routes";

/** Protects private routes and redirects authenticated users away from auth pages. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  const isPrivate   = PRIVATE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isPrivate && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|fonts|api).*)"],
};