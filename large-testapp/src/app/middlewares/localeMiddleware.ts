import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function helloWorld(request: NextRequest) {

  }
export function localeMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/') {
    const locale = request.headers.get('accept-language')?.split(',')[0] || 'en';
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  
  return NextResponse.next(); // Proceed to the next middleware if no redirect is needed
}
