import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cek cookie sesi login
  const hasSession =
    request.cookies.has("momen_admin_session") ||
    request.cookies.has("connect.sid");

  const isLoginPage = pathname === "/login";

  // Jika belum login dan mencoba mengakses halaman selain /login
  if (!hasSession && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    // Simpan returnUrl jika diperlukan
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Jika sudah login dan mencoba membuka halaman /login
  if (hasSession && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua request path KECUALI:
     * - api routes (/api/*)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo, icons dsb.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
