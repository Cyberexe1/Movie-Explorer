import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // If user is not authenticated and trying to access protected routes
    if (!req.nextauth.token && isProtectedRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // If user is authenticated and trying to access auth pages, redirect to home
    if (req.nextauth.token && isAuthRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (isPublicRoute(req.nextUrl.pathname)) {
          return true
        }
        
        // For protected routes, require authentication
        if (isProtectedRoute(req.nextUrl.pathname)) {
          return !!token
        }
        
        // Default: allow access
        return true
      },
    },
  }
)

function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    '/login',
    '/register',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/placeholder-movie.svg',
  ]
  
  return publicRoutes.some(route => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = [
    '/',
    '/movie',
    '/favorites',
    '/search',
  ]
  
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

function isAuthRoute(pathname: string): boolean {
  return pathname === '/login' || pathname === '/register'
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|placeholder-movie.svg).*)',
  ],
}