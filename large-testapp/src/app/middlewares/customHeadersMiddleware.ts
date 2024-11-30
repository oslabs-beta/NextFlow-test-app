import { NextResponse } from 'next/server';


export function customHeadersMiddleware() {
  const response = NextResponse.next();
  response.headers.set('X-Visualizer-Test', 'MiddlewareActive');
  return response;
}