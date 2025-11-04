import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const adminAccessToken = cookieStore.get('admin_access_token');
  const clientAccessToken = cookieStore.get('client_access_token');

  try {
    const {pathname} = req.nextUrl;
    if (pathname !== "/admin/login" && pathname.startsWith('/admin') && adminAccessToken === undefined) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (pathname.startsWith('/me') && clientAccessToken === undefined) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }

}

export const config = {
  matcher: ['/admin/:path*', '/me/:path*']
}