import { auth } from "@/lib/auth/auth";
import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function proxy(
  request: NextRequest,
) {
  const { pathname } = request.nextUrl;

  /*
   * Public admin login page.
   */
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.redirect(
      new URL(
        pathname.startsWith("/admin")
          ? "/admin/login"
          : "/login",
        request.url,
      ),
    );
  }

  const user =
    session.user as typeof session.user & {
      role?: string | null;
      ccUserId?: string | null;
    };

  /*
   * Admin routes require a local GC admin.
   */
  if (
    pathname.startsWith("/admin") &&
    user.role !== "admin"
  ) {
    return NextResponse.redirect(
      new URL("/customer", request.url),
    );
  }

  /*
   * Customer routes require:
   * role customer + a CC identity.
   */
  if (
    pathname.startsWith("/customer") &&
    (
      user.role !== "customer" ||
      !user.ccUserId
    )
  ) {
    return NextResponse.redirect(
      new URL(
        user.role === "admin"
          ? "/admin"
          : "/login",
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/customer/:path*",
  ],
};