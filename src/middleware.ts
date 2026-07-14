import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/stores/:path*',
    '/cart/:path*',
    '/orders/:path*',
    '/merchant/:path*',
    '/admin/:path*',
    '/available/:path*',
    '/current/:path*',
    '/history/:path*',
    '/profile/:path*',
  ],
};
