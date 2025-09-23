import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedRoutes = [
    '/admin',
    '/supervisor',
    '/student',
    '/account',
    '/cart',
    '/checkout',
  ];

  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add user info to headers for use in components
  const response = NextResponse.next();
  response.headers.set('X-User-Id', decoded.userId);
  response.headers.set('X-User-Role', decoded.role);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
