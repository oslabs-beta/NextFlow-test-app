import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Dummy middleware to test different features
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example 1: Authentication
  if (pathname.startsWith('/protected')) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Example 2: Locale Redirection
  if (pathname === '/') {
    const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Example 3: Custom Headers
  const response = NextResponse.next();
  response.headers.set('X-Visualizer-Test', 'MiddlewareActive');
  return response;
}

// Matcher to apply the middleware only on specific paths
export const config = {
  matcher: ['/protected/:path*', '/login', '/'],
};