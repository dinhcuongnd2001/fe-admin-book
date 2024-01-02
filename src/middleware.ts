import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export function middleware(req: NextRequest) {
  // if don't add config, i will lost file css
  // https://www.reddit.com/r/nextjs/comments/15gzjwm/nextjs_middleware_redirect_not_serving_css/?rdt=64369

  // if (req.nextUrl.pathname.startsWith("/_next")) {
  //   return NextResponse.next();
  // }
  if (req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/"],
};
