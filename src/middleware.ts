import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  console.log('🔒 Middleware - Path:', pathname, 'Has token:', !!token);

  // Define public routes
  const publicRoutes = [
    '/',
    '/login',
    '/clubs',
    '/events',
    '/about',
    '/subscribe',
    '/advisory',
    '/executive',
    '/webteam',
    '/members',
    '/news-events',
    '/reports',
    '/test-auth',
    '/debug-login',
    '/force-dashboard',
    '/debug-redirect',
  ];

  // Check if current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/profile');

  // If trying to access login page with token, redirect to dashboard
  if (pathname === '/login' && token) {
    console.log('✅ Middleware - Has token on login page, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('⛔ Middleware - No token for protected route, redirecting to login');
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};