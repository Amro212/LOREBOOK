import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hasAuthCookie = req.cookies.get("lb_auth")?.value === "1";
  if (!hasAuthCookie) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirectedFrom", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


