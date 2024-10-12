import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/";
  // const token = request.cookies.get("devfest_token")?.value || "";

  // Dev mode
  const Next_auth_token = request.cookies.get("next-auth.session-token")?.value;

  // Production mode
  // const Next_auth_token = request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Redirect authenticated users from public paths to home
  if (isPublicPath && Next_auth_token) {
    return NextResponse.redirect(new URL('/participation', request.nextUrl));
  }

  // Redirect unauthenticated users from private paths to login
  if (!isPublicPath  && !Next_auth_token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/participation",
    "/domains",
    "/registration",
    "/admin",
  ],
};