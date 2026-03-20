/**
 * Middleware helper for route protection using the auth_token cookie.
 *
 * The cookie is set by the useAuth hook when the user logs in via the
 * FastAPI backend.  We only check for the cookie's *presence* here —
 * the backend verifies the actual JWT when the frontend makes API calls.
 */

import { NextResponse, type NextRequest } from 'next/server';

const TOKEN_COOKIE = 'auth_token';

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isAuthenticated = !!token;

  // Redirect unauthenticated users to login page for protected routes
  const protectedRoutes = ['/dashboard', '/history'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
