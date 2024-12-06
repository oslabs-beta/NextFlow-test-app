import type { NextRequest } from 'next/server';
import { authMiddleware } from './authMiddleware';
import { localeMiddleware } from './localeMiddleware';
import { customHeadersMiddleware } from './customHeadersMiddleware';

export function middleware(request: NextRequest) {
  // Apply authentication middleware
  const authResponse = authMiddleware(request);
  if (authResponse) return authResponse;

  // Apply locale redirection middleware
  const localeResponse = localeMiddleware(request);
  if (localeResponse) return localeResponse;

  // Apply custom headers middleware
  return customHeadersMiddleware();
}


export const config = {
  matcher: ['/protected/:path*', '/login', '/'],
};