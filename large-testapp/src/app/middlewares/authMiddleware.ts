import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function helloWorld(request: NextRequest) {

}
export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/protected')) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  
  return NextResponse.next(); // Proceed to the next middleware if no redirect is needed
}